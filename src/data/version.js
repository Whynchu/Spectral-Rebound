const VERSION = { num: '0.65', label: 'Weighted Rooms' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
