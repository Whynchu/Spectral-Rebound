const VERSION = { num: '1.19.15', label: 'RUN SCORE BREAKDOWN' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






