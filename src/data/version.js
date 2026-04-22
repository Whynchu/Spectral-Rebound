const VERSION = { num: '1.19.22', label: 'LEADERBOARD TIME DISPLAY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






