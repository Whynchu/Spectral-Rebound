const VERSION = { num: '1.16.30', label: 'BLOOM START 15' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
