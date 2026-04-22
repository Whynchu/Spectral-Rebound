const VERSION = { num: '1.19.13', label: 'ANDROID WEBAPK FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






