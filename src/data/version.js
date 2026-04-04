const VERSION = { num: '0.96', label: 'Boss Rooms & Spawn Overhaul' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
