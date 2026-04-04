const VERSION = { num: '0.98', label: 'Boss Escort Cooldown' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
