const VERSION = { num: '1.16.96', label: 'HORN REFINEMENT' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






