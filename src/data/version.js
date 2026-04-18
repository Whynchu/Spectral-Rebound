const VERSION = { num: '1.16.79', label: 'RING ART HOTFIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






