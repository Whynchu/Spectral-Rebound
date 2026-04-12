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
import {
  getRoomDef,
  getRoomMaxOnScreen,
  getReinforcementIntervalMs,
  getBossEscortRespawnMs,
} from '../src/core/roomFlow.js';

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

test('room flow helpers keep threshold values', () => {
  assert.equal(getRoomMaxOnScreen(0, true), 99);
  assert.equal(getRoomMaxOnScreen(25, false), 12);
  assert.equal(getRoomMaxOnScreen(85, false), 18);
  assert.equal(getReinforcementIntervalMs(0), 800);
  assert.equal(getReinforcementIntervalMs(120), 360);
  assert.equal(getBossEscortRespawnMs(0), 7000);
  assert.equal(getBossEscortRespawnMs(160), 2800);
});

test('room flow generates non-boss and room-100 special boss layouts', () => {
  const roomScripts = ['ARRIVAL', 'PATROL', 'RUSH'];
  const bossRooms = {
    9: { name: 'MEGA ZONER', bossType: 'zoner', escortType: 'chaser', escortCount: 1, chaos: 0.24 },
    19: { name: 'MEGA TRIANGLE', bossType: 'triangle', escortType: 'rusher', escortCount: 2, chaos: 0.4 },
    29: { name: 'MEGA DISRUPTOR', bossType: 'purple_disruptor', escortType: 'purple_chaser', escortCount: 2, chaos: 0.5 },
    39: { name: 'MEGA ZONER II', bossType: 'orange_zoner', escortType: 'sniper', escortCount: 2, chaos: 0.55 },
  };
  const generatedWave = [{ t: 'chaser', n: 2, d: 0 }];
  const nonBoss = getRoomDef(3, {
    roomNames: roomScripts,
    bossRooms,
    generateWeightedWave: () => generatedWave,
  });
  assert.equal(nonBoss.isBossRoom, undefined);
  assert.equal(nonBoss.waves[0], generatedWave);

  const room100 = getRoomDef(99, {
    roomNames: roomScripts,
    bossRooms,
    generateWeightedWave: () => generatedWave,
  });
  assert.equal(room100.isBossRoom, true);
  assert.equal(room100.name, 'DOUBLE EXECUTION');
  assert.equal(room100.bossDamageMultiplier, 2);
  const bossEntries = room100.waves[0].filter((entry) => entry.isBoss);
  assert.equal(bossEntries.length, 2);
  assert.equal(bossEntries[0].bossScale, 2);
  assert.equal(bossEntries[1].bossScale, 2);
});

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
