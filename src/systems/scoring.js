function computeKillScore(points, isCrit = false) {
  const base = Number(points) || 0;
  return base * (isCrit ? 2 : 1);
}

function computeFiveRoomCheckpointBonus(rooms) {
  if(!Array.isArray(rooms) || rooms.length < 5) return 0;
  const recentRooms = rooms.slice(-5);
  if(recentRooms.some((room) => room.end !== 'clear')) return 0;

  const lastRoom = recentRooms[recentRooms.length - 1];
  const roomNumber = Number(lastRoom?.room) || 0;
  if(roomNumber % 5 !== 0) return 0;

  const totalClearMs = recentRooms.reduce((sum, room) => sum + (room.clearMs || 0), 0);
  const totalHpLost = recentRooms.reduce((sum, room) => sum + (room.hpLost || 0), 0);
  const damagelessCount = recentRooms.reduce((sum, room) => sum + (room.damageless ? 1 : 0), 0);
  const avgClearSeconds = Math.max(6, (totalClearMs / recentRooms.length) / 1000);
  const baseBonus = 260 + roomNumber * 26;
  const paceMultiplier = Math.max(0.65, Math.min(1.75, 26 / avgClearSeconds));
  const avoidanceMultiplier = Math.max(0.55, Math.min(1.4, 1.35 - totalHpLost / 320));
  const consistencyBonus = damagelessCount * 40;

  return Math.round(baseBonus * paceMultiplier * avoidanceMultiplier + consistencyBonus);
}

export { computeKillScore, computeFiveRoomCheckpointBonus };
