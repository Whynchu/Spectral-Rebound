const VERSION = { num: '1.16.35', label: 'BOSS CADENCE PASS' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
