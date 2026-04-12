function showGameOverScreen({
  panelEl,
  boonsPanelEl,
  scoreEl,
  noteEl,
  score,
  note,
  renderBoons,
}) {
  if(boonsPanelEl) boonsPanelEl.classList.add('off');
  if(scoreEl) scoreEl.textContent = score;
  if(noteEl) noteEl.textContent = note;
  renderBoons?.();
  panelEl?.classList.remove('off');
}

export { showGameOverScreen };
