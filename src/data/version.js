const VERSION = { num: '0.49', label: 'Leaderboard Overlay' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
