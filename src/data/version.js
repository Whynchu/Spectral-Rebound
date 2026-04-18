const VERSION = { num: '1.16.91', label: 'DESKTOP HATS TIDY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






