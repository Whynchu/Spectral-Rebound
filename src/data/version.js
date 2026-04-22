const VERSION = { num: '1.19.29', label: 'EXTRACT PAUSE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






