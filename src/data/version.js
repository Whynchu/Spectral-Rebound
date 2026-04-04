const VERSION = { num: '1.04', label: 'Aggressive Late-Game Scaling' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
