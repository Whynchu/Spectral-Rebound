const VERSION = { num: '0.58', label: 'Room 10 Clamp' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
