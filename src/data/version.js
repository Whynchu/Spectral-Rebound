const VERSION = { num: '1.07', label: 'Phase 2: Late-Game Scaling' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
