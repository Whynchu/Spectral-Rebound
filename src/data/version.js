const VERSION = { num: '1.16.78', label: 'OVERLOAD + THREAT TUNE' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






