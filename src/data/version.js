const VERSION = { num: '1.17.1', label: 'POWER DREAM' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






