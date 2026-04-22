const VERSION = { num: '1.19.18', label: 'GAME OVER POLISH' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






