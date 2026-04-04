const VERSION = { num: '1.03', label: 'Orange Enemy & Triangle Fixes' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
