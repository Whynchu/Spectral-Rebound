const VERSION = { num: '1.16.17', label: 'VERTICAL ARENA EXPANSION' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
