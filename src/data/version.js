const VERSION = { num: '1.16.84', label: 'TELEMETRY + CHARGE TUNING' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };






