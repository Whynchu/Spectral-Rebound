const VERSION = { num: '1.16.11', label: 'THREAT ROTATION + BOON SURGE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
