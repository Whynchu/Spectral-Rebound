import { pickBoonChoices, createHealBoon } from '../data/boons.js';

const BOON_FADE_MS = 180;

function showBoonSelection({ upg, hp, maxHp, onSelect, cardsContainer = document.getElementById('up-cards'), panel = document.getElementById('s-up') }) {
  const pool = [...pickBoonChoices(upg, hp, maxHp), createHealBoon(upg)];
  cardsContainer.innerHTML = '';
  cardsContainer.dataset.cardCount = String(pool.length);

  for(const boon of pool){
    const card = document.createElement('div');
    const tagColor = boon.tag === 'OFFENSE' ? '#f87171' : boon.tag === 'UTILITY' ? '#38bdf8' : boon.tag === 'HEAL' ? '#f87171' : '#4ade80';
    card.className = boon.tag === 'HEAL' ? 'up-card heal-card' : 'up-card';
    card.innerHTML = `
      <div class="up-icon">${boon.icon}</div>
      <div class="up-name">${boon.name}</div>
      <div class="up-desc">${boon.desc}</div>
      <div class="up-tag" style="color:${tagColor}">${boon.tag}</div>`;
    card.onclick = () => {
      if(panel.classList.contains('screen-leaving')) return;
      panel.classList.add('screen-leaving');
      window.setTimeout(() => {
        panel.classList.add('off');
        panel.classList.remove('screen-entering', 'screen-leaving');
        onSelect(boon);
      }, BOON_FADE_MS);
    };
    cardsContainer.appendChild(card);
  }

  panel.classList.remove('off', 'screen-leaving');
  panel.classList.add('screen-entering');
  window.setTimeout(() => panel.classList.remove('screen-entering'), BOON_FADE_MS);
}

export { showBoonSelection };
