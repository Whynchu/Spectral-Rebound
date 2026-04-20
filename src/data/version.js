const VERSION = { num: '1.18.1', label: 'DAMAGE SCALING FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






