function syncOrbRuntimeArrays(orbFireTimers, orbCooldown, orbitSphereTier) {
  while(orbFireTimers.length < orbitSphereTier) orbFireTimers.push(0);
  while(orbCooldown.length < orbitSphereTier) orbCooldown.push(0);
}

function getOrbitSlotPosition({
  index,
  orbitSphereTier,
  ts,
  rotationSpeed,
  radius,
  originX,
  originY,
} = {}) {
  const angle = Math.PI * 2 / orbitSphereTier * index + ts * rotationSpeed;
  return {
    angle,
    x: originX + Math.cos(angle) * radius,
    y: originY + Math.sin(angle) * radius,
  };
}

function getShieldSlotPosition({
  index,
  shieldCount,
  ts,
  rotationSpeed,
  radius,
  originX,
  originY,
} = {}) {
  const angle = Math.PI * 2 / shieldCount * index + ts * rotationSpeed;
  return {
    angle,
    x: originX + Math.cos(angle) * radius,
    y: originY + Math.sin(angle) * radius,
    facing: angle + Math.PI * 0.5,
  };
}

function tickShieldCooldowns(shields, dt, shieldTempered) {
  for(const shield of shields) {
    if(shield.cooldown > 0) {
      const prev = shield.cooldown;
      shield.cooldown = Math.max(0, shield.cooldown - dt);
      if(prev > 0 && shield.cooldown <= 0 && shieldTempered) shield.hardened = true;
    }
  }
}

function countReadyShields(shields) {
  if(!shields || shields.length === 0) return 0;
  let ready = 0;
  for(const shield of shields) {
    if((shield.cooldown || 0) <= 0) ready++;
  }
  return ready;
}

function advanceAegisBatteryTimer({
  aegisBattery,
  shieldTier,
  enemiesCount,
  readyShieldCount,
  timer,
  dtMs,
  intervalMs,
} = {}) {
  if(!aegisBattery || shieldTier <= 0 || enemiesCount <= 0 || readyShieldCount < shieldTier) {
    return { timer: 0, shouldFire: false };
  }
  const nextTimer = (timer || 0) + dtMs;
  if(nextTimer >= intervalMs) {
    return { timer: 0, shouldFire: true };
  }
  return { timer: nextTimer, shouldFire: false };
}

export {
  syncOrbRuntimeArrays,
  getOrbitSlotPosition,
  getShieldSlotPosition,
  tickShieldCooldowns,
  countReadyShields,
  advanceAegisBatteryTimer,
};
