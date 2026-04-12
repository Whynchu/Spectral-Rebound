const VERSION = { num: '1.16.49', label: 'LATE HP LIFT' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
