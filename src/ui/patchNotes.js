function buildPatchNoteCardHtml(note) {
  const paragraphs = (note.summary || [])
    .map((paragraph) => `<p class="patch-note-paragraph">${paragraph}</p>`)
    .join('');
  const highlights = (note.highlights || [])
    .map((item) => `<div class="patch-note-highlight">${item}</div>`)
    .join('');

  return `
      <div class="patch-note-meta">
        <div class="patch-note-version">v${note.version}</div>
        <div class="patch-note-label">${note.label}</div>
      </div>
      <div class="patch-note-copy">
        ${paragraphs}
        <div class="patch-note-highlights">${highlights}</div>
      </div>
    `;
}

function renderPatchNotesPanel({
  currentEl,
  listEl,
  archiveEl,
  versionNumber,
  versionLabel,
  notes,
  archiveMessage,
  doc = document,
}) {
  if(!currentEl || !listEl || !archiveEl) return;
  currentEl.textContent = `Current live build: v${versionNumber} — ${versionLabel}`;
  archiveEl.textContent = archiveMessage;
  listEl.innerHTML = '';
  for(const note of notes || []) {
    const card = doc.createElement('section');
    card.className = 'patch-note-entry';
    card.innerHTML = buildPatchNoteCardHtml(note);
    listEl.appendChild(card);
  }
}

function setPatchNotesVisibility(panelEl, isOpen) {
  if(!panelEl) return;
  panelEl.classList.toggle('off', !isOpen);
  panelEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

export { buildPatchNoteCardHtml, renderPatchNotesPanel, setPatchNotesVisibility };
