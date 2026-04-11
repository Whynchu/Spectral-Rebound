const VERSION = { num: '1.16.45', label: 'RUN CLOCK' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
