const VERSION = { num: '1.16.64', label: 'GRID COVER' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






