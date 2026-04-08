const VERSION = { num: '1.16.13', label: 'DARK BACKDROP RESTORE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
