function bindGestureGuards({
  doc = document,
  now = () => Date.now(),
  doubleTapWindowMs = 320,
} = {}) {
  let lastTouchEndAt = 0;
  let lastTouchStartAt = 0;

  const isEditableTarget = (target) => Boolean(
    target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]')
  );
  const isScrollableTarget = (target) => {
    if(!(target instanceof Element)) return false;
    let node = target;
    const view = doc.defaultView || window;
    while(node && node !== doc.body && node !== doc.documentElement) {
      const style = view.getComputedStyle(node);
      const overflowY = style?.overflowY || '';
      const touchAction = style?.touchAction || '';
      const canScrollY = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
      const allowsPanY = touchAction.includes('pan-y');
      if(canScrollY || allowsPanY) return true;
      node = node.parentElement;
    }
    return false;
  };
  const isNativeTouchTarget = (target) => isEditableTarget(target) || isScrollableTarget(target);

  const preventDefault = (event) => event.preventDefault();
  const preventSelectionOutsideInputs = (event) => {
    if(isEditableTarget(event.target)) return;
    event.preventDefault();
  };
  const preventTouchMoveOutsideInputs = (event) => {
    if(isNativeTouchTarget(event.target)) return;
    event.preventDefault();
  };
  const preventTouchStartDoubleTap = (event) => {
    if(isNativeTouchTarget(event.target)) return;
    const currentTime = now();
    if(currentTime - lastTouchStartAt < doubleTapWindowMs) {
      event.preventDefault();
    }
    lastTouchStartAt = currentTime;
  };
  const preventDoubleTap = (event) => {
    if(isNativeTouchTarget(event.target)) return;
    const currentTime = now();
    if(currentTime - lastTouchEndAt < doubleTapWindowMs) {
      event.preventDefault();
    }
    lastTouchEndAt = currentTime;
  };
  const clearSelectionOutsideInputs = () => {
    const active = doc.activeElement;
    if(isEditableTarget(active)) return;
    const selection = doc.getSelection ? doc.getSelection() : null;
    if(selection && selection.rangeCount > 0 && String(selection).length > 0) {
      selection.removeAllRanges();
    }
  };

  doc.addEventListener('contextmenu', preventDefault);
  doc.addEventListener('dblclick', preventDefault);
  doc.addEventListener('selectstart', preventSelectionOutsideInputs);
  doc.addEventListener('touchstart', preventTouchStartDoubleTap, { passive: false });
  doc.addEventListener('touchmove', preventTouchMoveOutsideInputs, { passive: false });
  doc.addEventListener('touchend', preventDoubleTap, { passive: false });
  doc.addEventListener('touchcancel', preventDoubleTap, { passive: false });
  doc.addEventListener('selectionchange', clearSelectionOutsideInputs);
  doc.addEventListener('gesturestart', preventDefault, { passive: false });
  doc.addEventListener('gesturechange', preventDefault, { passive: false });
  doc.addEventListener('gestureend', preventDefault, { passive: false });

  return () => {
    doc.removeEventListener('contextmenu', preventDefault);
    doc.removeEventListener('dblclick', preventDefault);
    doc.removeEventListener('selectstart', preventSelectionOutsideInputs);
    doc.removeEventListener('touchstart', preventTouchStartDoubleTap, { passive: false });
    doc.removeEventListener('touchmove', preventTouchMoveOutsideInputs, { passive: false });
    doc.removeEventListener('touchend', preventDoubleTap, { passive: false });
    doc.removeEventListener('touchcancel', preventDoubleTap, { passive: false });
    doc.removeEventListener('selectionchange', clearSelectionOutsideInputs);
    doc.removeEventListener('gesturestart', preventDefault, { passive: false });
    doc.removeEventListener('gesturechange', preventDefault, { passive: false });
    doc.removeEventListener('gestureend', preventDefault, { passive: false });
  };
}

export { bindGestureGuards };
