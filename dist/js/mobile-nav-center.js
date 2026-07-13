/* Runtime fallback for mobile navigation alignment.
   Applies after all styles so legacy utility classes cannot pull the controls left. */
(function () {
  'use strict';

  function applyMobileNavLayout() {
    const nav = document.querySelector('body > nav');
    if (!nav) return;

    const mobile = (window.visualViewport?.width || window.innerWidth || 0) <= 767;
    if (!mobile) {
      ['left','right','width','max-width','transform','justify-content','overflow-x'].forEach(prop => nav.style.removeProperty(prop));
      return;
    }

    const veryNarrow = (window.visualViewport?.width || window.innerWidth || 0) <= 360;
    nav.style.setProperty('left', '50%', 'important');
    nav.style.setProperty('right', 'auto', 'important');
    nav.style.setProperty('transform', 'translateX(-50%)', 'important');
    nav.style.setProperty('max-width', 'calc(100vw - 16px)', 'important');
    nav.style.setProperty('width', veryNarrow ? 'calc(100vw - 12px)' : 'max-content', 'important');
    nav.style.setProperty('justify-content', veryNarrow ? 'flex-start' : 'center', 'important');
    nav.style.setProperty('overflow-x', 'auto', 'important');
  }

  const schedule = () => requestAnimationFrame(applyMobileNavLayout);
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(schedule, 150), { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule, { passive: true });
  if (document.readyState !== 'loading') schedule();
})();
