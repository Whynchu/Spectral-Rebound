const VERSION = { num: '1.16.92', label: 'HATS FOLLOW-UP' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






