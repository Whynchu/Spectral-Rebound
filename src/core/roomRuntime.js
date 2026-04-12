function advanceRoomIntroPhase({ roomPhase, roomIntroTimer, dtMs }) {
  if(roomPhase !== 'intro') {
    return { roomPhase, roomIntroTimer, shouldShowGo: false, shouldHideIntro: false };
  }

  const nextIntroTimer = roomIntroTimer + dtMs;
  if(nextIntroTimer >= 1600) {
    return {
      roomPhase: 'spawning',
      roomIntroTimer: nextIntroTimer,
      shouldShowGo: false,
      shouldHideIntro: true,
    };
  }

  return {
    roomPhase: 'intro',
    roomIntroTimer: nextIntroTimer,
    shouldShowGo: nextIntroTimer >= 1000 && nextIntroTimer < 1600,
    shouldHideIntro: false,
  };
}

function getPendingWaveIntroIndex({ roomPhase, enemiesCount, spawnQueue, activeWaveIndex }) {
  if(!(roomPhase === 'spawning' || roomPhase === 'fighting')) return null;
  if(enemiesCount !== 0) return null;
  if(!Array.isArray(spawnQueue) || spawnQueue.length === 0) return null;
  if(spawnQueue[0].waveIndex <= activeWaveIndex) return null;
  return spawnQueue[0].waveIndex;
}

function pullWaveSpawnEntries({
  spawnQueue,
  activeWaveIndex,
  roomTimer,
  maxOnScreen,
  enemiesCount,
}) {
  const remainingQueue = Array.isArray(spawnQueue) ? [...spawnQueue] : [];
  const spawnEntries = [];
  let simulatedEnemyCount = enemiesCount;

  while(
    remainingQueue.length
    && remainingQueue[0].waveIndex === activeWaveIndex
    && remainingQueue[0].spawnAt <= roomTimer
  ) {
    if(simulatedEnemyCount >= maxOnScreen) break;
    spawnEntries.push(remainingQueue.shift());
    simulatedEnemyCount++;
  }

  return { spawnEntries, remainingQueue };
}

function getPostSpawningPhase({ spawnQueueLen, enemiesCount }) {
  if(spawnQueueLen === 0 && enemiesCount > 0) return 'fighting';
  if(spawnQueueLen === 0 && enemiesCount === 0) return 'clear';
  return null;
}

function shouldForceClearFromCombat({ roomPhase, enemiesCount, spawnQueueLen }) {
  return (roomPhase === 'fighting' || roomPhase === 'spawning')
    && enemiesCount === 0
    && spawnQueueLen === 0;
}

function updateBossEscortRespawn({
  escortAlive,
  escortMaxCount,
  escortRespawnTimer,
  dtMs,
  respawnMs,
}) {
  if(escortAlive >= escortMaxCount) {
    return { escortRespawnTimer: 0, shouldSpawnEscort: false };
  }

  const nextTimer = escortRespawnTimer + dtMs;
  if(nextTimer >= respawnMs) {
    return { escortRespawnTimer: 0, shouldSpawnEscort: true };
  }
  return { escortRespawnTimer: nextTimer, shouldSpawnEscort: false };
}

function pullReinforcementSpawn({
  isBossRoom,
  spawnQueue,
  activeWaveIndex,
  enemiesCount,
  maxOnScreen,
  reinforceTimer,
  dtMs,
  intervalMs,
}) {
  const remainingQueue = Array.isArray(spawnQueue) ? [...spawnQueue] : [];
  if(
    isBossRoom
    || remainingQueue.length === 0
    || remainingQueue[0].waveIndex !== activeWaveIndex
    || enemiesCount >= maxOnScreen
  ) {
    return { reinforceTimer, spawnEntry: null, remainingQueue };
  }

  const nextTimer = reinforceTimer + dtMs;
  if(nextTimer >= intervalMs) {
    return {
      reinforceTimer: 0,
      spawnEntry: remainingQueue.shift(),
      remainingQueue,
    };
  }
  return { reinforceTimer: nextTimer, spawnEntry: null, remainingQueue };
}

function advanceClearPhase({ roomPhase, roomClearTimer, dtMs, rewardDelayMs = 1000 }) {
  if(roomPhase !== 'clear') {
    return { roomPhase, roomClearTimer, shouldShowUpgrades: false };
  }
  const nextTimer = roomClearTimer + dtMs;
  if(nextTimer > rewardDelayMs) {
    return { roomPhase: 'reward', roomClearTimer: nextTimer, shouldShowUpgrades: true };
  }
  return { roomPhase: 'clear', roomClearTimer: nextTimer, shouldShowUpgrades: false };
}

export {
  advanceRoomIntroPhase,
  getPendingWaveIntroIndex,
  pullWaveSpawnEntries,
  getPostSpawningPhase,
  shouldForceClearFromCombat,
  updateBossEscortRespawn,
  pullReinforcementSpawn,
  advanceClearPhase,
};
