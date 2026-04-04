const VERSION = { num: '1.01', label: 'Disruptor & Async Enemy Balance' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
