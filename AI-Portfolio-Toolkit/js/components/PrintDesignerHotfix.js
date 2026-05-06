// js/components/PrintDesignerHotfix.js
// V33 hotfix: make PDF Layout Studio prefer the currently rendered page data.
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

  function getCandidateFromWindow() {
    const names = ['__AI_PORTFOLIO_ACTIVE_DATA', 'ACTIVE_PORTFOLIO_DATA', 'currentData', 'portfolioData', 'profileData'];
    for (const name of names) {
      try {
        const value = window[name];
        if (value && typeof value === 'object' && (value.name_th || value.name_en || value.bio_th || value.bio_en || value.exp)) {
          return clone(value);
        }
      } catch (_) {}
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
    const win = getCandidateFromWindow();
    if (win && !isDemoData(win)) return win;

    const dom = getCandidateFromDom();
    if (dom && !isDemoData(dom)) return dom;

    try {
      const stored = originalLoad ? originalLoad() : null;
      if (stored && !isDemoData(stored)) return stored;
      return stored || dom || win || null;
    } catch (_) {
      return dom || win || null;
    }
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

  if (!installPatch()) {
    const timer = setInterval(() => {
      if (installPatch()) clearInterval(timer);
    }, 300);
    setTimeout(() => clearInterval(timer), 8000);
  }
})();
