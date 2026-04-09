const VERSION = { num: '1.16.26', label: 'SCORE SUBMIT HOTFIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
