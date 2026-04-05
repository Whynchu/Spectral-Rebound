const VERSION = { num: '1.16.2', label: 'THREAT CLEANUP' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
