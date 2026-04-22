const VERSION = { num: '1.19.26', label: 'ROOM CLEAR DEDUPE + JANITOR' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






