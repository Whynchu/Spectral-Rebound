const VERSION = { num: '1.19.28', label: 'EXTRACT OBSTACLES' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






