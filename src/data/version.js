const VERSION = { num: '0.94', label: 'Elite Enemies & Scaling' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
