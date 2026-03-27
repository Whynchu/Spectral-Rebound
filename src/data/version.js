const VERSION = { num: '0.71', label: 'Orbit Spacing' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
