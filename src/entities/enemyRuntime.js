function clampEnemyToArena(enemy, width, height, margin) {
  enemy.x = Math.max(margin + enemy.r, Math.min(width - margin - enemy.r, enemy.x));
  enemy.y = Math.max(margin + enemy.r, Math.min(height - margin - enemy.r, enemy.y));
}

function stepSiphonEnemy(enemy, {
  ts,
  dt,
  width,
  height,
  margin,
  player,
} = {}) {
  enemy.x += Math.sin(ts * 0.0009 + enemy.y) * 22 * dt;
  enemy.y += Math.cos(ts * 0.0011 + enemy.x) * 22 * dt;
  clampEnemyToArena(enemy, width, height, margin);
  return {
    shouldDrainCharge: Math.hypot(enemy.x - player.x, enemy.y - player.y) < 72,
  };
}

function stepRusherEnemy(enemy, {
  player,
  dt,
  width,
  height,
  margin,
} = {}) {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.hypot(dx, dy);
  if(distance > enemy.r && distance > 0) {
    enemy.x += dx / distance * enemy.spd * dt;
    enemy.y += dy / distance * enemy.spd * dt;
  }
  clampEnemyToArena(enemy, width, height, margin);
  return { distanceToPlayer: distance };
}

function advanceRangedEnemyCombatState(enemy, {
  player,
  ts,
  dt,
  width,
  height,
  margin,
  gravityWell2 = false,
  windupMs = 520,
} = {}) {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.hypot(dx, dy);
  const fleeRange = enemy.fleeRange || 110;
  let speed = enemy.spd;
  if(gravityWell2) speed *= 0.8;

  enemy.fT += dt * 1000;
  const inWindup = enemy.fT >= enemy.fRate - windupMs;

  if(!inWindup && distance > 0) {
    if(distance < fleeRange) {
      const nx = dx / distance;
      const ny = dy / distance;
      const strafeDir = (Math.sin(ts * 0.0008 + enemy.eid * 1.3) > 0) ? 1 : -1;
      enemy.x -= nx * speed * dt + (-ny) * speed * (enemy.strafeSpd || 0.6) * strafeDir * dt;
      enemy.y -= ny * speed * dt + nx * speed * (enemy.strafeSpd || 0.6) * strafeDir * dt;
    } else if(distance > fleeRange * 1.6) {
      enemy.x += dx / distance * speed * 0.25 * dt;
      enemy.y += dy / distance * speed * 0.25 * dt;
    } else {
      const strafeDir = (Math.sin(ts * 0.0007 + enemy.eid * 2.1) > 0) ? 1 : -1;
      enemy.x += (-dy / distance) * speed * (enemy.strafeSpd || 0.6) * strafeDir * dt;
      enemy.y += (dx / distance) * speed * (enemy.strafeSpd || 0.6) * strafeDir * dt;
    }
    clampEnemyToArena(enemy, width, height, margin);
  }

  if(enemy.disruptorCooldown > 0) {
    enemy.disruptorCooldown -= dt * 1000;
  }

  const shouldFire = enemy.fT >= enemy.fRate && enemy.disruptorCooldown <= 0;
  if(shouldFire) enemy.fT = 0;

  return {
    distanceToPlayer: distance,
    inWindup,
    shouldFire,
  };
}

function applyDisruptorPostFire(enemy) {
  if(enemy.type !== 'disruptor') return false;
  enemy.disruptorBulletCount += enemy.burst;
  if(enemy.disruptorBulletCount >= 5) {
    enemy.disruptorBulletCount = 0;
    enemy.disruptorCooldown = 800;
    return true;
  }
  return false;
}

export {
  clampEnemyToArena,
  stepSiphonEnemy,
  stepRusherEnemy,
  advanceRangedEnemyCombatState,
  applyDisruptorPostFire,
};
