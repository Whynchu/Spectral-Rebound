const VERSION = { num: '1.19.30', label: 'EXTRACT TELEMETRY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






