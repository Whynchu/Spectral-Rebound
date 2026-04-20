const VERSION = { num: '1.18.0', label: 'UI REFINEMENT' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






