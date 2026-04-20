const VERSION = { num: '1.19.2', label: 'LEGENDARY FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






