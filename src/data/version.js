const VERSION = { num: '1.19.4', label: 'CAT EARS & DOUBLE-SHOT FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






