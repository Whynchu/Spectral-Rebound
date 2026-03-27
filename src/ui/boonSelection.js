import { pickBoonChoices, createHealBoon } from '../data/boons.js';

const BOON_FADE_MS = 180;

function showBoonSelection({ upg, hp, maxHp, onSelect, cardsContainer = document.getElementById('up-cards'), panel = document.getElementById('s-up') }) {
  const pool = pickBoonChoices(upg, hp, maxHp);
  const healBoon = createHealBoon(upg);
  cardsContainer.innerHTML = '';
  cardsContainer.dataset.cardCount = '3';

  const mainRow = document.createElement('div');
  mainRow.className = 'up-cards-main';
  const healRow = document.createElement('div');
  healRow.className = 'up-heal-row';

  for(const boon of pool){
    const card = document.createElement('div');
    const tagColor = boon.tag === 'OFFENSE' ? '#f87171' : boon.tag === 'UTILITY' ? '#38bdf8' : '#4ade80';
    card.className = 'up-card';
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
    mainRow.appendChild(card);
  }

  const healCard = document.createElement('div');
  healCard.className = 'up-card heal-card heal-card-small';
  healCard.innerHTML = `
    <div class="up-icon">${healBoon.icon}</div>
    <div class="up-name">${healBoon.name}</div>
    <div class="up-desc">${healBoon.desc}</div>
    <div class="up-tag" style="color:#f87171">${healBoon.tag}</div>`;
  healCard.onclick = () => {
    if(panel.classList.contains('screen-leaving')) return;
    panel.classList.add('screen-leaving');
    window.setTimeout(() => {
      panel.classList.add('off');
      panel.classList.remove('screen-entering', 'screen-leaving');
      onSelect(healBoon);
    }, BOON_FADE_MS);
  };
  healRow.appendChild(healCard);

  cardsContainer.appendChild(mainRow);
  cardsContainer.appendChild(healRow);

  panel.classList.remove('off', 'screen-leaving');
  panel.classList.add('screen-entering');
  window.setTimeout(() => panel.classList.remove('screen-entering'), BOON_FADE_MS);
}

export { showBoonSelection };
