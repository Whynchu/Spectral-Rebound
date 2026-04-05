const VERSION = { num: '1.14.0-fix2', label: 'Phase 7: Syntax error fix' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
