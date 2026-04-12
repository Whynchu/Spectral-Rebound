function revealAppShell({ doc = document, raf = requestAnimationFrame } = {}) {
  raf(() => {
    doc.body.classList.remove('app-loading');
    doc.body.classList.add('app-ready');
  });
}

function syncColorDrivenCopy(copyEl, dangerKey) {
  if(!copyEl) return;
  copyEl.textContent = `${dangerKey} rounds`;
}

function setMenuChromeVisible({ doc = document, isVisible, onResize } = {}) {
  doc.body.classList.toggle('menu-chrome-visible', isVisible);
  onResize?.();
}

export { revealAppShell, syncColorDrivenCopy, setMenuChromeVisible };
