const VERSION = { num: '0.46', label: 'Gameplay Ownership' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
