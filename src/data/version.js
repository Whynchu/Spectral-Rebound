const VERSION = { num: '1.16.89', label: 'HATS LAYOUT HOTFIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






