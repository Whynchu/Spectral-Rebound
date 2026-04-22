// Obstacle / cover-cube geometry & collision resolution.
//
// Pure module: all state (the obstacles array) is passed in from the caller.
// script.js keeps the `roomObstacles` let; this module exposes the math.

export function createRoomObstacles(width, height, { margin, gridSize, wallCubeSize }) {
  const arenaWidth = Math.max(0, width - 2 * margin);
  const arenaHeight = Math.max(0, height - 2 * margin);
  const cols = Math.max(1, Math.floor(arenaWidth / gridSize));
  const rows = Math.max(1, Math.floor(arenaHeight / gridSize));
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const leftCol = Math.max(1, Math.min(cols - 2, cx - 3));
  const rightCol = Math.max(1, Math.min(cols - 2, cx + 2));
  const topRow = Math.max(1, cy - 2);
  const bottomRow = Math.min(rows - 2, cy + 1);
  const inset = (gridSize - wallCubeSize) * 0.5;

  const cells = [];
  for (let y = topRow; y <= bottomRow; y++) {
    cells.push({ col: leftCol, row: y });
    cells.push({ col: rightCol, row: y });
  }

  return cells.map(({ col, row }) => ({
    x: margin + col * gridSize + inset,
    y: margin + row * gridSize + inset,
    w: wallCubeSize,
    h: wallCubeSize,
  }));
}

export function getCircleRectContactNormal(x, y, radius, rect) {
  const nearestX = Math.max(rect.x, Math.min(x, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(y, rect.y + rect.h));
  const dx = x - nearestX;
  const dy = y - nearestY;
  const distSq = dx * dx + dy * dy;
  if (distSq > radius * radius) return null;

  if (distSq > 0.0001) {
    const dist = Math.sqrt(distSq);
    return { nx: dx / dist, ny: dy / dist, push: radius - dist };
  }

  const leftPen = Math.abs(x - rect.x);
  const rightPen = Math.abs((rect.x + rect.w) - x);
  const topPen = Math.abs(y - rect.y);
  const bottomPen = Math.abs((rect.y + rect.h) - y);
  const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);
  if (minPen === leftPen) return { nx: -1, ny: 0, push: radius };
  if (minPen === rightPen) return { nx: 1, ny: 0, push: radius };
  if (minPen === topPen) return { nx: 0, ny: -1, push: radius };
  return { nx: 0, ny: 1, push: radius };
}

export function resolveEntityObstacleCollisions(entity, obstacles, maxPasses = 3) {
  if (!entity || !obstacles || !obstacles.length) return;
  for (let pass = 0; pass < maxPasses; pass++) {
    let hadContact = false;
    for (const obstacle of obstacles) {
      const contact = getCircleRectContactNormal(entity.x, entity.y, entity.r, obstacle);
      if (!contact) continue;
      hadContact = true;
      entity.x += contact.nx * (contact.push + 0.05);
      entity.y += contact.ny * (contact.push + 0.05);
    }
    if (!hadContact) break;
  }
}

export function isEntityOverlappingObstacle(entity, obstacles) {
  if (!entity || !obstacles || !obstacles.length) return false;
  for (const obstacle of obstacles) {
    if (getCircleRectContactNormal(entity.x, entity.y, entity.r, obstacle)) return true;
  }
  return false;
}

export function ejectEntityFromObstacles(entity, obstacles) {
  if (!entity) return;
  resolveEntityObstacleCollisions(entity, obstacles, 14);
  if (!isEntityOverlappingObstacle(entity, obstacles)) return;
  for (const obstacle of obstacles) {
    const contact = getCircleRectContactNormal(entity.x, entity.y, entity.r, obstacle);
    if (!contact) continue;
    entity.x += contact.nx * (contact.push + entity.r + 2);
    entity.y += contact.ny * (contact.push + entity.r + 2);
  }
  resolveEntityObstacleCollisions(entity, obstacles, 14);
}

export function resolveBulletObstacleCollision(bullet, obstacles) {
  if (!bullet || !obstacles || !obstacles.length) return false;
  for (const obstacle of obstacles) {
    const contact = getCircleRectContactNormal(bullet.x, bullet.y, bullet.r, obstacle);
    if (!contact) continue;
    bullet.x += contact.nx * (contact.push + 0.05);
    bullet.y += contact.ny * (contact.push + 0.05);
    if (Math.abs(contact.nx) >= Math.abs(contact.ny)) bullet.vx = -bullet.vx;
    else bullet.vy = -bullet.vy;
    return true;
  }
  return false;
}

export function segmentIntersectsRect(ax, ay, bx, by, rect, pad = 0) {
  const minX = rect.x - pad;
  const maxX = rect.x + rect.w + pad;
  const minY = rect.y - pad;
  const maxY = rect.y + rect.h + pad;
  const dx = bx - ax;
  const dy = by - ay;
  let tMin = 0;
  let tMax = 1;
  const tests = [
    { p: -dx, q: ax - minX },
    { p: dx, q: maxX - ax },
    { p: -dy, q: ay - minY },
    { p: dy, q: maxY - ay },
  ];
  for (const { p, q } of tests) {
    if (Math.abs(p) < 0.000001) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) {
      if (t > tMax) return false;
      if (t > tMin) tMin = t;
    } else {
      if (t < tMin) return false;
      if (t < tMax) tMax = t;
    }
  }
  return tMax >= tMin;
}

export function hasObstacleLineBlock(ax, ay, bx, by, obstacles, pad = 1.5) {
  if (!obstacles || !obstacles.length) return false;
  for (const obstacle of obstacles) {
    if (segmentIntersectsRect(ax, ay, bx, by, obstacle, pad)) return true;
  }
  return false;
}
