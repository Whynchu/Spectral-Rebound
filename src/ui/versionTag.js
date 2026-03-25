import { formatVersionTag } from '../data/version.js';

function renderVersionTag(version, element = document.getElementById('version-tag')) {
  if (!element) return;
  element.textContent = formatVersionTag(version);
}

export { renderVersionTag };
