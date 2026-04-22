const VERSION = { num: '1.19.20', label: 'LEADERBOARD DURATION' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






