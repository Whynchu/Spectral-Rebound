const VERSION = { num: '1.00', label: 'Elite Enemy Visual Clarity' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
