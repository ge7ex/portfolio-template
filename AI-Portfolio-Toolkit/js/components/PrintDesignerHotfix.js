// js/components/PrintDesignerHotfix.js
// V39 hotfix: active data resolver + responsive/mobile QA + print pagination guard.
(function () {
  'use strict';

  const escText = value => String(value || '').replace(/\s+/g, ' ').trim();
  const isDemoData = data => {
    if (!data) return true;
    const marker = `${data.name_th || ''} ${data.name_en || ''} ${data.role_th || ''} ${data.role_en || ''}`;
    return !!data._isFirstRunDemo || /Your Portfolio|Portfolio Template|Your Name/i.test(marker);
  };

  function clone(data) {
    try { return JSON.parse(JSON.stringify(data || {})); } catch (_) { return data || {}; }
  }

  function hasUsefulData(data) {
    if (!data || isDemoData(data)) return false;
    const keys = ['name_th', 'name_en', 'role_th', 'role_en', 'bio_th', 'bio_en', 'skills_th', 'skills_en', 'email', 'phone', 'linkedin', 'avatar'];
    if (keys.some(key => escText(data[key]))) return true;
    return Array.isArray(data.exp) && data.exp.some(item => {
      if (!item) return false;
      return ['title_th', 'title_en', 'company_th', 'company_en', 'desc_th', 'desc_en', 'title', 'company', 'desc'].some(key => escText(item[key])) ||
        (Array.isArray(item.images) && item.images.some(Boolean));
    });
  }

  function mergeUsefulData(primary, fallback) {
    const base = clone(fallback || {});
    const next = clone(primary || {});
    Object.keys(next).forEach(key => {
      const value = next[key];
      if (Array.isArray(value)) {
        if (value.length) base[key] = value;
      } else if (value && typeof value === 'object') {
        base[key] = { ...(base[key] || {}), ...value };
      } else if (escText(value)) {
        base[key] = value;
      }
    });
    return base;
  }

  function getCandidateFromWindow() {
    const names = ['__AI_PORTFOLIO_ACTIVE_DATA', 'ACTIVE_PORTFOLIO_DATA', 'currentData', 'portfolioData', 'profileData'];
    for (const name of names) {
      try {
        const value = window[name];
        if (value && typeof value === 'object' && (value.name_th || value.name_en || value.bio_th || value.bio_en || value.exp)) {
          return clone(value);
        }
      } catch (_) { }
    }
    return null;
  }

  function imageSrc(img) {
    return img ? (img.currentSrc || img.src || img.getAttribute('src') || '') : '';
  }

  function getCandidateFromDom() {
    const app = document.getElementById('app');
    if (!app) return null;

    const header = app.querySelector('header, .portfolio-hero, .resume-cv-sidebar header') || app;
    const name = escText((header.querySelector('h1') || app.querySelector('h1') || {}).textContent);
    const role = escText((header.querySelector('p, h2, h3') || {}).textContent);
    const sections = Array.from(app.querySelectorAll('section'));
    const findSection = regex => sections.find(section => regex.test(escText(section.textContent).slice(0, 160)));
    const bioSection = findSection(/summary|ประวัติโดยย่อ|professional/i);
    const skillsSection = app.querySelector('.skills-section') || findSection(/skills|ทักษะ/i);
    const expRoot = app.querySelector('.experience-section') || findSection(/experience|ประสบการณ์|ผลงาน/i);

    const cleanSection = (section, labels) => {
      if (!section) return '';
      let text = escText(section.textContent);
      labels.forEach(label => { text = text.replace(new RegExp('^' + label + '\\s*', 'i'), ''); });
      return text.trim();
    };

    const avatar = imageSrc(app.querySelector('header img, .hero-avatar img, img.hero-avatar, .resume-cv-sidebar img'));
    const exp = [];
    if (expRoot) {
      const items = Array.from(expRoot.querySelectorAll('.print-exp-item, .scrollytelling-wrapper, .resume-card, .story-section, .unified-card'));
      items.slice(0, 10).forEach((item, index) => {
        const title = escText((item.querySelector('h4, h2, h3') || {}).textContent) || `Project ${index + 1}`;
        const company = escText((item.querySelector('h5') || {}).textContent);
        const desc = escText((item.querySelector('p') || {}).textContent);
        const images = Array.from(item.querySelectorAll('img')).map(imageSrc).filter(Boolean).filter(src => src !== avatar);
        if (title || company || desc || images.length) {
          exp.push({ title_th: title, title_en: title, company_th: company, company_en: company, desc_th: desc, desc_en: desc, images });
        }
      });
    }

    if (!exp.length) {
      const images = Array.from(app.querySelectorAll('img')).map(imageSrc).filter(Boolean).filter(src => src !== avatar);
      if (images.length) exp.push({ title_th: 'Project Images', title_en: 'Project Images', company_th: '', company_en: '', desc_th: '', desc_en: '', images });
    }

    if (!name && !role && !exp.length && !avatar) return null;
    return {
      _fromRenderedDom: true,
      name_th: name,
      name_en: name,
      role_th: role,
      role_en: role,
      bio_th: cleanSection(bioSection, ['Professional Summary', 'Summary', 'ประวัติโดยย่อ']),
      bio_en: cleanSection(bioSection, ['Professional Summary', 'Summary', 'ประวัติโดยย่อ']),
      skills_th: cleanSection(skillsSection, ['Skills & Expertise', 'Skills', 'ทักษะและความเชี่ยวชาญ', 'ทักษะ']),
      skills_en: cleanSection(skillsSection, ['Skills & Expertise', 'Skills', 'ทักษะและความเชี่ยวชาญ', 'ทักษะ']),
      avatar,
      exp,
      lang: document.documentElement.lang === 'en' ? 'en' : 'th',
      layout: document.body.classList.contains('layout-resume') ? 'resume' : 'portfolio'
    };
  }

  function resolveActiveData(originalLoad) {
    let stored = null;
    try { stored = originalLoad ? originalLoad() : null; } catch (_) { stored = null; }

    const candidates = [getCandidateFromWindow(), stored, getCandidateFromDom()].filter(hasUsefulData);
    if (candidates.length) {
      return candidates.slice(1).reduce((acc, item) => mergeUsefulData(acc, item), candidates[0]);
    }
    return stored || getCandidateFromDom() || getCandidateFromWindow() || null;
  }

  function installPatch() {
    if (!window.PrintDesigner || window.PrintDesigner.__activeDataPatched) return false;
    const originalOpen = window.PrintDesigner.open;
    if (typeof originalOpen !== 'function') return false;

    window.PrintDesigner.open = function patchedOpen(mode) {
      const originalLoad = window.StorageHandler && StorageHandler.load;
      const activeData = resolveActiveData(originalLoad);
      if (activeData) window.__AI_PORTFOLIO_ACTIVE_DATA = activeData;

      if (window.StorageHandler && typeof originalLoad === 'function') {
        StorageHandler.load = function loadActiveForPrintDesigner() {
          return clone(activeData || originalLoad());
        };
        try {
          return originalOpen.call(window.PrintDesigner, mode);
        } finally {
          StorageHandler.load = originalLoad;
        }
      }
      return originalOpen.call(window.PrintDesigner, mode);
    };

    window.PrintDesigner.__activeDataPatched = true;
    return true;
  }

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.prepend(meta);
    }
    meta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
  }

  function injectResponsiveAndPaginationCss() {
    if (document.getElementById('v39-responsive-pagination-hotfix')) return;
    const style = document.createElement('style');
    style.id = 'v39-responsive-pagination-hotfix';
    style.textContent = `
      /* V39 Responsive QA: mobile/tablet shell, editor modal, studio, and print pagination guard. */
      html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
      img, video, canvas, svg { max-width: 100%; height: auto; }
      #app { overflow-wrap: anywhere; }

      @media (max-width: 1023px) {
        body { overflow-x: hidden; }
        nav {
          left: max(10px, env(safe-area-inset-left)) !important;
          right: max(10px, env(safe-area-inset-right)) !important;
          top: max(10px, env(safe-area-inset-top)) !important;
          transform: none !important;
          width: auto !important;
          max-width: calc(100vw - 20px) !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          justify-content: flex-start !important;
          gap: .5rem !important;
          padding: .45rem !important;
          border-radius: 1.25rem !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        nav::-webkit-scrollbar { display: none !important; }
        nav button { flex: 0 0 auto !important; min-width: 44px !important; min-height: 44px !important; }
        #app.container { width: 100% !important; max-width: 100% !important; padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 6.5rem !important; }
        #theme-panel {
          position: fixed !important;
          left: max(12px, env(safe-area-inset-left)) !important;
          right: max(12px, env(safe-area-inset-right)) !important;
          top: 76px !important;
          width: auto !important;
          max-height: calc(100dvh - 92px) !important;
          overflow-y: auto !important;
        }
        #public-export-branch {
          position: fixed !important;
          right: max(12px, env(safe-area-inset-right)) !important;
          bottom: max(12px, env(safe-area-inset-bottom)) !important;
          z-index: 70 !important;
        }
        #edit-modal { padding: .75rem !important; align-items: stretch !important; }
        #edit-modal > div {
          width: 100% !important;
          max-width: 100% !important;
          max-height: calc(100dvh - 1.5rem) !important;
          border-radius: 1.25rem !important;
        }
        #edit-modal .px-8 { padding-left: 1rem !important; padding-right: 1rem !important; }
        #edit-modal .p-8 { padding: 1rem !important; }
        #edit-modal .gap-8 { gap: .75rem !important; }
        #edit-modal [id^="tab-"] { flex: 0 0 auto !important; white-space: nowrap !important; }
        #edit-modal .border-b.bg-\[\#0f172a\], #edit-modal .flex.px-8.pt-4 {
          overflow-x: auto !important;
          scrollbar-width: none !important;
        }
        #edit-modal .border-b.bg-\[\#0f172a\]::-webkit-scrollbar, #edit-modal .flex.px-8.pt-4::-webkit-scrollbar { display:none!important; }
        #edit-modal .grid { min-width: 0 !important; }
        #edit-modal input, #edit-modal textarea, #edit-modal select { font-size: 16px !important; min-width: 0 !important; }
      }

      @media (max-width: 640px) {
        nav .px-4 { padding-left: .8rem !important; padding-right: .8rem !important; }
        nav button[onclick="toggleModal()"] span { display: none !important; }
        .portfolio-hero { border-radius: 1.5rem !important; }
        .hero-title { font-size: clamp(2.25rem, 14vw, 4rem) !important; line-height: .95 !important; }
        .hero-frame { width: min(88vw, 300px) !important; padding: 10px !important; }
        .unified-card { border-radius: 1.5rem !important; }
        .scrollytelling-track img { width: 82vw !important; max-width: 82vw !important; height: 220px !important; }
        .resume-cv-shell { grid-template-columns: 1fr !important; border-radius: 1.5rem !important; }
        .resume-cv-sidebar, .resume-cv-main { padding: 1.25rem !important; }
      }

      @media (max-width: 900px) {
        .print-designer-root .pd-body { grid-template-columns: 1fr !important; }
        .print-designer-root .pd-sidebar {
          max-height: 38dvh !important;
          border-right: 0 !important;
          border-bottom: 1px solid rgba(148,163,184,.25) !important;
        }
        .print-designer-root .pd-workspace { padding: 12px !important; }
        .print-designer-root .pd-stage { justify-content: flex-start !important; padding: 12px !important; }
        .print-designer-root .pd-page { transform-origin: top left !important; }
        .print-designer-root .pd-topbar { height: auto !important; min-height: 68px !important; align-items: flex-start !important; }
        .print-designer-root .pd-top-actions { overflow-x: auto !important; flex-wrap: nowrap !important; max-width: 100% !important; }
        .print-designer-root .pd-top-actions button { flex: 0 0 auto !important; }
      }

      @media print {
        /* V39 pagination rule: keep headings with their first content block and avoid orphaned project cards. */
        h1, h2, h3, h4, h5, .pd-section-heading, .resume-cv-main h3, .resume-cv-sidebar h3 {
          break-after: avoid-page !important;
          page-break-after: avoid !important;
          orphans: 3 !important;
          widows: 3 !important;
        }
        p, li, .pd-project-desc, .pd-project-list {
          orphans: 3 !important;
          widows: 3 !important;
        }
        .resume-card, .print-exp-item, .unified-card, .print-order-extra, .pd-project, .pd-image, .pd-object-content {
          break-inside: avoid-page !important;
          page-break-inside: avoid !important;
        }
        .experience-section, .resume-cv-main, .resume-cv-sidebar, .print-layout-wrapper {
          break-inside: auto !important;
          page-break-inside: auto !important;
        }
        .cinematic-image-wrapper, .cinematic-image-inner, .scrollytelling-wrapper, .scrollytelling-track {
          max-height: none !important;
          overflow: visible !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function installV39() {
    ensureViewportMeta();
    injectResponsiveAndPaginationCss();
  }

  if (!installPatch()) {
    const timer = setInterval(() => {
      if (installPatch()) clearInterval(timer);
    }, 300);
    setTimeout(() => clearInterval(timer), 8000);
  }

  // =========================
  // V39 RESPONSIVE + PAGINATION QA
  // =========================

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.prepend(meta);
    }

    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, viewport-fit=cover'
    );
  }

  function injectV39Css() {
    if (document.getElementById('v39-responsive-hotfix')) return;

    const style = document.createElement('style');
    style.id = 'v39-responsive-hotfix';

    style.textContent = `
      /* =========================
         V39 Responsive QA
      ========================== */

      html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      img,
      video,
      canvas,
      svg {
        max-width: 100%;
        height: auto;
      }

      body {
        overflow-x: hidden;
      }

      #app {
        overflow-wrap: anywhere;
      }

      /* =========================
         Tablet / Mobile Nav
      ========================== */

      @media (max-width: 1023px) {

        nav {
          left: 10px !important;
          right: 10px !important;
          top: 10px !important;

          width: auto !important;
          max-width: calc(100vw - 20px);

          overflow-x: auto !important;
          overflow-y: hidden !important;

          scrollbar-width: none !important;
          -ms-overflow-style: none !important;

          padding: 6px !important;
          gap: 8px !important;

          justify-content: flex-start !important;
        }

        nav::-webkit-scrollbar {
          display: none !important;
        }

        nav button {
          flex: 0 0 auto !important;
          min-width: 44px !important;
          min-height: 44px !important;
        }

        #app.container {
          padding-top: 7rem !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }

        #theme-panel {
          left: 12px !important;
          right: 12px !important;
          top: 76px !important;

          width: auto !important;

          max-height: calc(100dvh - 90px);
          overflow-y: auto !important;
        }

        #edit-modal {
          padding: .75rem !important;
        }

        #edit-modal > div {
          width: 100% !important;
          max-width: 100% !important;

          max-height: calc(100dvh - 1.5rem) !important;

          border-radius: 1.25rem !important;
        }

        #edit-modal input,
        #edit-modal textarea,
        #edit-modal select {
          font-size: 16px !important;
        }

        .resume-cv-shell {
          grid-template-columns: 1fr !important;
        }

        .resume-cv-sidebar,
        .resume-cv-main {
          width: 100% !important;
        }
      }

      /* =========================
         Small Mobile
      ========================== */

      @media (max-width: 640px) {

        nav button[onclick="toggleModal()"] span {
          display: none !important;
        }

        .hero-title {
          font-size: clamp(2.2rem, 14vw, 4rem) !important;
          line-height: .95 !important;
        }

        .hero-frame {
          width: min(88vw, 300px) !important;
        }

        .unified-card {
          border-radius: 1.5rem !important;
        }

        .scrollytelling-track img {
          width: 82vw !important;
          max-width: 82vw !important;
          height: 220px !important;
        }
      }

      /* =========================
         Studio Responsive
      ========================== */

      @media (max-width: 900px) {

        .print-designer-root .pd-body {
          grid-template-columns: 1fr !important;
        }

        .print-designer-root .pd-sidebar {
          max-height: 38dvh !important;

          border-right: 0 !important;
          border-bottom: 1px solid rgba(148,163,184,.25) !important;
        }

        .print-designer-root .pd-stage {
          justify-content: flex-start !important;
          padding: 12px !important;
        }

        .print-designer-root .pd-top-actions {
          overflow-x: auto !important;
          flex-wrap: nowrap !important;
        }

        .print-designer-root .pd-top-actions button {
          flex: 0 0 auto !important;
        }
      }

      /* =========================
         PRINT PAGINATION RULES
      ========================== */

      @media print {

        h1,
        h2,
        h3,
        h4,
        h5,
        .pd-section-heading {
          break-after: avoid-page !important;
          page-break-after: avoid !important;

          orphans: 3 !important;
          widows: 3 !important;
        }

        p,
        li {
          orphans: 3 !important;
          widows: 3 !important;
        }

        .resume-card,
        .print-exp-item,
        .unified-card,
        .pd-project,
        .pd-image {
          break-inside: avoid-page !important;
          page-break-inside: avoid !important;
        }

        .cinematic-image-wrapper,
        .cinematic-image-inner,
        .scrollytelling-wrapper,
        .scrollytelling-track {
          max-height: none !important;
          overflow: visible !important;

          opacity: 1 !important;
          transform: none !important;
        }

        .studio-grid,
        .studio-guide,
        .studio-overlay {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function installV39() {
    ensureViewportMeta();
    injectV39Css();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installV39, { once: true });
  } else {
    installV39();
  }
})();
