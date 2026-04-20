const VERSION = { num: '1.17.9', label: 'LEGENDARY REJECTION & SCALING' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






