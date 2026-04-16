const VERSION = { num: '1.16.65', label: 'HUNT LINES' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






