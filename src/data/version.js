const VERSION = { num: '1.16.16', label: 'ROOM BADGE RETIRED' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
