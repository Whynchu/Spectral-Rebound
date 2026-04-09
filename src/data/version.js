const VERSION = { num: '1.16.21', label: 'OFFENSE TELEMETRY' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
