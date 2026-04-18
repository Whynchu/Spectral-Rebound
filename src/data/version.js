const VERSION = { num: '1.16.99', label: 'SUSTAINED FIRE & SPS SYNERGY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






