const VERSION = { num: '0.88c', label: 'Balance & Gating' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
