(() => {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function ensureStyle() {
    if (document.getElementById('adaptive-scrollytelling-style')) return;
    const style = document.createElement('style');
    style.id = 'adaptive-scrollytelling-style';
    style.textContent = `
      body.layout-portfolio .experience-section .scrollytelling-wrapper {
        height: var(--adaptive-scrolly-height, 125vh) !important;
        min-height: 0 !important;
        margin-bottom: clamp(1.5rem, 3vh, 2.5rem) !important;
      }
      body.layout-portfolio .experience-section .scrollytelling-track .scrolly-spacer:last-child {
        flex: 0 0 0px !important;
        width: 0 !important;
        min-width: 0 !important;
      }
      @media (max-width: 1023px) {
        body.layout-portfolio .experience-section .scrollytelling-wrapper {
          height: var(--adaptive-scrolly-height, 125vh) !important;
          min-height: 0 !important;
        }
        body.layout-portfolio .experience-section .scrollytelling-track .scrolly-spacer:last-child {
          flex-basis: 0 !important;
          width: 0 !important;
          min-width: 0 !important;
        }
      }
      @media print {
        body.layout-portfolio .experience-section .scrollytelling-wrapper {
          height: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function detachLegacy() {
    if (window._scrollHandler) window.removeEventListener('scroll', window._scrollHandler);
    if (window._scrollResizeHandler) window.removeEventListener('resize', window._scrollResizeHandler);
    if (window._orientationScrollHandler) window.removeEventListener('orientationchange', window._orientationScrollHandler);
    if (window.visualViewport && window._vvScrollHandler) {
      window.visualViewport.removeEventListener('resize', window._vvScrollHandler);
      window.visualViewport.removeEventListener('scroll', window._vvScrollHandler);
    }
  }

  function initAdaptiveScrollytelling() {
    ensureStyle();
    detachLegacy();

    if (window._revealObserver?.disconnect) window._revealObserver.disconnect();
    window._revealObserver = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      }),
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => window._revealObserver.observe(el));

    const wrappers = [...document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper')];
    const progressBar = document.getElementById('scroll-progress');
    const heroFrame = document.querySelector('.hero-frame');
    let raf = 0;

    function measure(wrapper) {
      const track = wrapper.querySelector('.scrollytelling-track');
      const imageBox = wrapper.querySelector('.cinematic-image-wrapper');
      const sticky = wrapper.querySelector('.sticky');
      if (!track || !imageBox || !sticky) return null;

      const collapsed = imageBox.classList.contains('cinematic-collapsed');
      imageBox.classList.remove('cinematic-collapsed');
      imageBox.classList.add('cinematic-expanded');

      const vh = window.visualViewport?.height || window.innerHeight || 1;
      const parentWidth = Math.max(
        1,
        track.parentElement?.clientWidth || 0,
        wrapper.clientWidth || 0
      );
      const maxX = Math.max(0, Math.ceil(track.scrollWidth - parentWidth));
      const stickyH = Math.max(1, sticky.offsetHeight || sticky.getBoundingClientRect().height || 1);
      const lead = clamp(vh * 0.045, 28, 48);
      const move = Math.max(maxX, vh * 0.12);
      const release = 12;
      const total = Math.ceil(stickyH + lead + move + release);

      wrapper.style.setProperty('--adaptive-scrolly-height', `${total}px`);
      wrapper.dataset.maxX = String(maxX);
      wrapper.dataset.lead = String(lead);
      wrapper.dataset.move = String(move);
      wrapper.dataset.release = String(release);

      if (collapsed) {
        imageBox.classList.add('cinematic-collapsed');
        imageBox.classList.remove('cinematic-expanded');
      }

      return { track, imageBox, sticky, maxX, lead, move, release };
    }

    function metrics(wrapper) {
      const track = wrapper.querySelector('.scrollytelling-track');
      const imageBox = wrapper.querySelector('.cinematic-image-wrapper');
      const sticky = wrapper.querySelector('.sticky');
      const maxX = Number(wrapper.dataset.maxX);
      const lead = Number(wrapper.dataset.lead);
      const move = Number(wrapper.dataset.move);
      const release = Number(wrapper.dataset.release);

      return track && imageBox && sticky && [maxX, lead, move, release].every(Number.isFinite)
        ? { track, imageBox, sticky, maxX, lead, move, release }
        : measure(wrapper);
    }

    function update() {
      raf = 0;
      const vh = window.visualViewport?.height || window.innerHeight || 1;
      const maxPage = Math.max(1, document.documentElement.scrollHeight - vh);
      const pageProgress = clamp(window.scrollY / maxPage, 0, 1);

      if (progressBar) progressBar.style.width = `${pageProgress * 100}%`;
      if (heroFrame) {
        heroFrame.style.setProperty('--profile-scroll-angle', `${Math.round(pageProgress * 720)}deg`);
        heroFrame.style.setProperty('--profile-scroll-glow', `${0.45 + pageProgress * 0.45}`);
      }

      wrappers.forEach(wrapper => {
        const m = metrics(wrapper);
        if (!m) return;

        const rect = wrapper.getBoundingClientRect();
        const stickyTop = parseFloat(getComputedStyle(m.sticky).top) || Math.min(64, vh * 0.06);
        const travelled = stickyTop - rect.top;
        const moveProgress = clamp((travelled - m.lead) / m.move, 0, 1);
        m.track.style.setProperty('--scrolly-x', `-${m.maxX * moveProgress}px`);

        const finish = m.lead + m.move;
        const collapseAt = finish + m.release;
        const visible = rect.bottom > stickyTop && rect.top < vh;
        const active = visible && travelled > 6 && travelled < collapseAt;

        m.imageBox.classList.toggle('cinematic-expanded', active);
        m.imageBox.classList.toggle('cinematic-collapsed', !active);
        wrapper.classList.toggle('scrolly-terminal-collapsed', travelled >= collapseAt);
      });
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const remeasure = () => {
      wrappers.forEach(wrapper => {
        delete wrapper.dataset.maxX;
        delete wrapper.dataset.lead;
        delete wrapper.dataset.move;
        delete wrapper.dataset.release;
        measure(wrapper);
      });
      schedule();
    };

    window._scrollHandler = schedule;
    window._scrollResizeHandler = () => {
      remeasure();
      setTimeout(remeasure, 120);
    };
    window._orientationScrollHandler = () => setTimeout(remeasure, 220);
    window._vvScrollHandler = window._scrollResizeHandler;

    window.addEventListener('scroll', window._scrollHandler, { passive: true });
    window.addEventListener('resize', window._scrollResizeHandler, { passive: true });
    window.addEventListener('orientationchange', window._orientationScrollHandler, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', window._vvScrollHandler, { passive: true });
      window.visualViewport.addEventListener('scroll', window._vvScrollHandler, { passive: true });
    }

    wrappers.forEach(wrapper => {
      wrapper.querySelectorAll('img').forEach(img => {
        if (!img.complete) img.addEventListener('load', remeasure, { once: true });
      });
      measure(wrapper);
    });
    schedule();
  }

  window.installAdaptiveScrollytelling = initAdaptiveScrollytelling;
  window.initScrollEffects = initAdaptiveScrollytelling;

  const install = () => {
    window.initScrollEffects = initAdaptiveScrollytelling;
    initAdaptiveScrollytelling();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(install, 120), { once: true });
  } else {
    setTimeout(install, 120);
  }
  window.addEventListener('load', () => {
    setTimeout(install, 180);
    setTimeout(install, 500);
  }, { once: true });
})();
