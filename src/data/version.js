const VERSION = { num: '1.06', label: 'Phase 1: Vampiric Expansion' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
