const VERSION = { num: '1.16.87', label: 'HAT PREVIEW HOTFIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






