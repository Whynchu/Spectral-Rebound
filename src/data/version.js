const VERSION = { num: '0.79c', label: 'Shield & Rebound' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
