// Safari mobile reports unstable viewport heights while browser chrome animates.
function fixSafariViewport() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const vh = viewportHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari && /Mobile/.test(navigator.userAgent)) {
    document.documentElement.style.height = `${viewportHeight}px`;
    document.documentElement.style.minHeight = `${viewportHeight}px`;
    document.body.style.height = `${viewportHeight}px`;
    document.body.style.minHeight = `${viewportHeight}px`;
    document.body.style.position = 'relative';
  }
}

function bindResponsiveViewport(onResize) {
  const handleResize = () => {
    fixSafariViewport();
    onResize();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize);
  }

  handleResize();
}

export { bindResponsiveViewport };
