// Live game-state container. Holds the runtime entity arrays that are
// mutated heavily by the main game loop. Keeping stable array references
// (never reassigned) lets modules import them by reference.
//
// To clear an array, use `resetEntities()` or call `.length = 0` on the
// array itself. Never reassign these exports.

const gameEntities = {
  bullets: [],
  enemies: [],
  shockwaves: [],
  spawnQueue: [],
};

function resetEntities() {
  gameEntities.bullets.length = 0;
  gameEntities.enemies.length = 0;
  gameEntities.shockwaves.length = 0;
  gameEntities.spawnQueue.length = 0;
}

function resetBullets() {
  gameEntities.bullets.length = 0;
}

const { bullets, enemies, shockwaves, spawnQueue } = gameEntities;

export { gameEntities, bullets, enemies, shockwaves, spawnQueue, resetEntities, resetBullets };
