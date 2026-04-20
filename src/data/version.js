const VERSION = { num: '1.18.9', label: 'CAT EARS FIX 2' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






