import { pickBoonChoices } from '../data/boons.js';

function showBoonSelection({ upg, hp, maxHp, onSelect, cardsContainer = document.getElementById('up-cards'), panel = document.getElementById('s-up') }) {
  const pool = pickBoonChoices(upg, hp, maxHp);
  cardsContainer.innerHTML = '';

  for(const boon of pool){
    const card = document.createElement('div');
    const tagColor = boon.tag === 'OFFENSE' ? '#f87171' : boon.tag === 'UTILITY' ? '#38bdf8' : '#4ade80';
    card.className = 'up-card';
    card.innerHTML = `
      <div class="up-icon">${boon.icon}</div>
      <div class="up-name">${boon.name}</div>
      <div class="up-desc">${boon.desc}</div>
      <div class="up-tag" style="color:${tagColor}">${boon.tag}</div>`;
    card.onclick = () => onSelect(boon);
    cardsContainer.appendChild(card);
  }

  panel.classList.remove('off');
}

export { showBoonSelection };
