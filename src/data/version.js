const VERSION = { num: '1.16.7', label: 'PATCH NOTES HUD FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
