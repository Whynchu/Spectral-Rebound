const VERSION = { num: '1.16.32', label: 'ORB SHOT LINE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
