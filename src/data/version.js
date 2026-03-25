const VERSION = { num: '0.48', label: 'SPS Cooldown Guard' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
