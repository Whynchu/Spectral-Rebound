const VERSION = { num: '1.16.76', label: 'COLOR ASSIST SETTINGS' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






