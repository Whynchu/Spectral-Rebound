const VERSION = { num: '1.13.3', label: 'BUNNY TIME' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
