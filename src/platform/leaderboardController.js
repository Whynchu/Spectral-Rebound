function createLeaderboardSyncState() {
  return {
    requestSeq: 0,
    remoteRows: [],
    useRemoteRows: false,
    statusMode: 'local',
    statusText: 'LOCAL ONLY',
  };
}

function beginLeaderboardSync(state) {
  state.requestSeq += 1;
  state.remoteRows = [];
  state.useRemoteRows = false;
  state.statusMode = 'syncing';
  state.statusText = 'SYNCING';
  return state.requestSeq;
}

function applyLeaderboardSyncSuccess(state, requestId, rows) {
  if(requestId !== state.requestSeq) return false;
  state.remoteRows = Array.isArray(rows) ? rows : [];
  state.useRemoteRows = true;
  state.statusMode = 'synced';
  state.statusText = 'SUPABASE LIVE';
  return true;
}

function applyLeaderboardSyncFailure(state, requestId) {
  if(requestId !== state.requestSeq) return false;
  state.remoteRows = [];
  state.useRemoteRows = false;
  state.statusMode = 'local';
  state.statusText = 'LOCAL FALLBACK';
  return true;
}

function forceLocalLeaderboardFallback(state, text = 'LOCAL FALLBACK') {
  state.remoteRows = [];
  state.useRemoteRows = false;
  state.statusMode = 'local';
  state.statusText = text;
}

export {
  createLeaderboardSyncState,
  beginLeaderboardSync,
  applyLeaderboardSyncSuccess,
  applyLeaderboardSyncFailure,
  forceLocalLeaderboardFallback,
};
