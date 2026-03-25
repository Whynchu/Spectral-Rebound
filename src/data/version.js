const VERSION = { num: '0.50', label: 'Leaderboard Screen' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
