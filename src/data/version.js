const VERSION = { num: '1.19.1', label: 'CAT EARS TWEAK' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






