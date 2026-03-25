const VERSION = { num: '0.51', label: 'Cache Sync Guard' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
