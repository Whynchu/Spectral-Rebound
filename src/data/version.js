const VERSION = { num: '1.16.9', label: 'PATCH NOTES SIZE FIX' };

function formatVersionTag(version = VERSION) {
  return `// prototype v${version.num} - ${version.label}`;
}

export { VERSION, formatVersionTag };
