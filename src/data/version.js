const VERSION = { num: '0.63', label: 'Intro Heal Pass' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
