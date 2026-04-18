const VERSION = { num: '1.16.85', label: 'PAYLOAD BLAST RETUNE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






