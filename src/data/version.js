const VERSION = { num: '1.16.15', label: 'GAME VIEW RECLAIM' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
