const VERSION = { num: '1.18.4', label: 'BUTTON SWAP FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






