const VERSION = { num: '1.19.12', label: 'REFACTOR + SCROLLBAR TAKE 3' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






