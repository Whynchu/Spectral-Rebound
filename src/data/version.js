const VERSION = { num: '0.95', label: 'Elite Zoner Variants' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
