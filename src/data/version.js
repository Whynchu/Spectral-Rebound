const VERSION = { num: '1.16.12', label: 'SMALL IPHONE FIT' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
