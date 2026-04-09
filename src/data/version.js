const VERSION = { num: '1.16.23', label: 'RUN RECOVERY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
