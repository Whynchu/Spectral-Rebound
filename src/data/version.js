const VERSION = { num: '0.72', label: 'Kinetic Gate' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
