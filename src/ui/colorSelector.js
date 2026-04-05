// Color selector UI component — compact inline button that cycles through colors

import { cyclePlayerColor, getPlayerColor, getPlayerColorScheme } from '../data/colorScheme.js';

function renderColorSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scheme = getPlayerColorScheme();
  container.innerHTML = '';
  container.className = 'color-btn-wrap';

  const btn = document.createElement('button');
  btn.className = 'color-btn';
  btn.type = 'button';
  btn.setAttribute('title', `Color: ${scheme.name} — tap to change`);
  btn.setAttribute('aria-label', `Player color: ${scheme.name}. Tap to cycle.`);
  btn.style.background = scheme.hex;
  btn.style.boxShadow = `0 0 10px ${scheme.hex}55`;
  btn.textContent = scheme.icon;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const next = cyclePlayerColor();
    btn.style.background = next.hex;
    btn.style.boxShadow = `0 0 10px ${next.hex}55`;
    btn.textContent = next.icon;
    btn.setAttribute('title', `Color: ${next.name} — tap to change`);
    btn.setAttribute('aria-label', `Player color: ${next.name}. Tap to cycle.`);
  });

  container.appendChild(btn);
}

export { renderColorSelector };
