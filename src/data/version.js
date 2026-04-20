const VERSION = { num: '1.19.0', label: 'CAT EARS FINAL' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






