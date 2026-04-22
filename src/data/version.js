const VERSION = { num: '1.19.19', label: 'STATE ENCAPSULATION' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






