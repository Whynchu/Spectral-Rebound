function formatRunTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderHud({
  roomIndex,
  runElapsedMs,
  score,
  charge,
  maxCharge,
  sps,
  elements,
}) {
  if(!elements) return;
  elements.roomCounter.textContent = `ROOM ${roomIndex + 1} • ${formatRunTime(runElapsedMs)}`;
  elements.scoreText.textContent = score;
  elements.chargeFill.style.width = `${Math.max(0, Math.min(100, (charge / maxCharge) * 100))}%`;
  elements.chargeBadge.textContent = `${Math.floor(charge)} / ${maxCharge}`;
  elements.spsNumber.textContent = sps.toFixed(1);
}

export { formatRunTime, renderHud };
