const DEFAULT_KILL_SUSTAIN_CAP_CONFIG = {
  baseHealCap: 14,
  perRoomHealCap: 0.22,
  maxHealCap: 34,
};

function getKillSustainCapForRoom(roomIndex = 0, config = DEFAULT_KILL_SUSTAIN_CAP_CONFIG) {
  const room = Number.isFinite(roomIndex) ? roomIndex : 0;
  return Math.min(
    config.maxHealCap,
    Math.round(config.baseHealCap + room * config.perRoomHealCap)
  );
}

function applyKillSustainHeal({
  amount,
  roomIndex = 0,
  healedThisRoom = 0,
  healPlayer,
  source,
  config = DEFAULT_KILL_SUSTAIN_CAP_CONFIG,
}) {
  if(amount <= 0) return { applied: 0, healedThisRoom };
  const remaining = Math.max(0, getKillSustainCapForRoom(roomIndex, config) - healedThisRoom);
  if(remaining <= 0) return { applied: 0, healedThisRoom };
  const applied = Number(healPlayer(Math.min(amount, remaining), source)) || 0;
  return {
    applied,
    healedThisRoom: healedThisRoom + applied,
  };
}

export {
  DEFAULT_KILL_SUSTAIN_CAP_CONFIG,
  getKillSustainCapForRoom,
  applyKillSustainHeal,
};
