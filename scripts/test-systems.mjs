import assert from 'node:assert/strict';
import {
  getKillSustainCapForRoom,
  applyKillSustainHeal,
} from '../src/systems/sustain.js';
import {
  computeKillScore,
  computeFiveRoomCheckpointBonus,
} from '../src/systems/scoring.js';
import { computeProjectileHitDamage } from '../src/systems/damage.js';
import {
  weightedPick,
  generateWeightedWave,
  buildSpawnQueue,
} from '../src/systems/spawnBudget.js';
import {
  createLeaderboardSyncState,
  beginLeaderboardSync,
  applyLeaderboardSyncSuccess,
  applyLeaderboardSyncFailure,
  forceLocalLeaderboardFallback,
} from '../src/platform/leaderboardController.js';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

test('kill sustain cap scales by room and respects max', () => {
  const config = { baseHealCap: 14, perRoomHealCap: 0.22, maxHealCap: 34 };
  assert.equal(getKillSustainCapForRoom(0, config), 14);
  assert.equal(getKillSustainCapForRoom(10, config), 16);
  assert.equal(getKillSustainCapForRoom(200, config), 34);
});

test('applyKillSustainHeal enforces remaining room cap', () => {
  let hp = 80;
  const maxHp = 200;
  const healPlayer = (amount) => {
    const before = hp;
    hp = Math.min(maxHp, hp + amount);
    return hp - before;
  };
  const config = { baseHealCap: 14, perRoomHealCap: 0.22, maxHealCap: 34 };
  let healedThisRoom = 13;

  const first = applyKillSustainHeal({
    amount: 10,
    roomIndex: 0,
    healedThisRoom,
    healPlayer,
    source: 'vampiric',
    config,
  });
  assert.equal(first.applied, 1);
  assert.equal(first.healedThisRoom, 14);

  const second = applyKillSustainHeal({
    amount: 10,
    roomIndex: 0,
    healedThisRoom: first.healedThisRoom,
    healPlayer,
    source: 'vampiric',
    config,
  });
  assert.equal(second.applied, 0);
  assert.equal(second.healedThisRoom, 14);
});

test('computeKillScore doubles crit kills only', () => {
  assert.equal(computeKillScore(120, false), 120);
  assert.equal(computeKillScore(120, true), 240);
});

test('computeFiveRoomCheckpointBonus returns expected value for clean block', () => {
  const rooms = [
    { room: 1, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 2, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 3, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 4, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 5, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
  ];
  assert.equal(computeFiveRoomCheckpointBonus(rooms), 1121);
});

test('computeFiveRoomCheckpointBonus returns zero for non-clear block', () => {
  const rooms = [
    { room: 1, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 2, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 3, end: 'death', clearMs: 10000, hpLost: 20, damageless: false },
    { room: 4, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
    { room: 5, end: 'clear', clearMs: 10000, hpLost: 0, damageless: true },
  ];
  assert.equal(computeFiveRoomCheckpointBonus(rooms), 0);
});

test('computeProjectileHitDamage matches baseline room scaling', () => {
  assert.equal(computeProjectileHitDamage({ roomIndex: 0 }), 17);
  assert.equal(computeProjectileHitDamage({ roomIndex: 10 }), 27);
  assert.equal(computeProjectileHitDamage({ roomIndex: 50 }), 65);
});

test('computeProjectileHitDamage applies external multipliers', () => {
  const damage = computeProjectileHitDamage({
    roomIndex: 20,
    bossDamageMultiplier: 2,
    damageTakenMultiplier: 1.18,
    lateBloomDamageTakenMultiplier: 0.9,
    multiplier: 0.05,
  });
  assert.equal(damage, 4);
});

test('weightedPick uses candidate weights', () => {
  const candidates = [
    { type: 'a', weight: 1 },
    { type: 'b', weight: 3 },
  ];
  assert.equal(weightedPick(candidates, () => 0.0), 'a');
  assert.equal(weightedPick(candidates, () => 0.99), 'b');
});

test('generateWeightedWave keeps non-empty waves and fallback pressure', () => {
  const enemyTypes = {
    chaser: { unlockRoom: 0, spawnValue: 5, ammoPressure: 0, isSiphon: false },
    siphon: { unlockRoom: 0, spawnValue: 2, ammoPressure: 0, isSiphon: true },
    sniper: { unlockRoom: 99, spawnValue: 4, ammoPressure: 1, isSiphon: false },
    disruptor: { unlockRoom: 99, spawnValue: 4, ammoPressure: 1, isSiphon: false },
    triangle: { unlockRoom: 99, spawnValue: 4, ammoPressure: 0, isSiphon: false },
    purple_chaser: { unlockRoom: 99, spawnValue: 4, ammoPressure: 1, isSiphon: false },
    purple_disruptor: { unlockRoom: 99, spawnValue: 4, ammoPressure: 1, isSiphon: false },
    zoner: { unlockRoom: 99, spawnValue: 4, ammoPressure: 1, isSiphon: false },
  };
  const wave = generateWeightedWave(0, enemyTypes, () => 0.0);
  assert.ok(Array.isArray(wave) && wave.length > 0);
  const byType = Object.fromEntries(wave.map((entry) => [entry.t, entry.n]));
  assert.ok(byType.chaser >= 1);
});

test('buildSpawnQueue preserves wave order and spawn timing', () => {
  const queue = buildSpawnQueue({
    waves: [
      [{ t: 'chaser', n: 2, d: 100 }],
      [{ t: 'sniper', n: 1, d: 0 }],
    ],
  });
  assert.equal(queue.length, 3);
  assert.equal(queue[0].spawnAt, 0);
  assert.equal(queue[1].spawnAt, 100);
  assert.equal(queue[2].spawnAt, 1900);
  assert.equal(queue[2].waveIndex, 1);
});

test('leaderboard sync state transitions are deterministic', () => {
  const state = createLeaderboardSyncState();
  assert.equal(state.statusMode, 'local');
  assert.equal(state.statusText, 'LOCAL ONLY');

  const requestId = beginLeaderboardSync(state);
  assert.equal(requestId, 1);
  assert.equal(state.statusMode, 'syncing');
  assert.equal(state.useRemoteRows, false);

  const staleAccepted = applyLeaderboardSyncSuccess(state, 999, [{ name: 'A' }]);
  assert.equal(staleAccepted, false);
  assert.equal(state.statusMode, 'syncing');

  const accepted = applyLeaderboardSyncSuccess(state, 1, [{ name: 'A' }]);
  assert.equal(accepted, true);
  assert.equal(state.statusMode, 'synced');
  assert.equal(state.statusText, 'SUPABASE LIVE');
  assert.equal(state.useRemoteRows, true);
  assert.equal(state.remoteRows.length, 1);

  forceLocalLeaderboardFallback(state);
  assert.equal(state.statusMode, 'local');
  assert.equal(state.statusText, 'LOCAL FALLBACK');
  assert.equal(state.useRemoteRows, false);
});

test('leaderboard failure transition ignores stale request ids', () => {
  const state = createLeaderboardSyncState();
  const requestId = beginLeaderboardSync(state);
  assert.equal(requestId, 1);
  const staleFailure = applyLeaderboardSyncFailure(state, 999);
  assert.equal(staleFailure, false);
  assert.equal(state.statusMode, 'syncing');
  const appliedFailure = applyLeaderboardSyncFailure(state, 1);
  assert.equal(appliedFailure, true);
  assert.equal(state.statusMode, 'local');
  assert.equal(state.statusText, 'LOCAL FALLBACK');
});

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
