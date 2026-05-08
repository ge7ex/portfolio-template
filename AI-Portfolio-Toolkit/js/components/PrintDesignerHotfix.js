// js/components/PrintDesignerHotfix.js
// V43: resolve active portfolio data for PDF Layout Studio without letting demo placeholders override real content.
(function () {
  'use strict';

  const placeholderRx = /^(Your Portfolio|Portfolio Template|Your Name|hello@example\.com|\+66 00 000 0000|linkedin\.com\/in\/your-profile|Portfolio, Resume, Projects, Skills, Contact|Add your name, role, summary, skills, and project work to turn this template into a finished portfolio\.|Featured project placeholder|Your work or organization|Replace this block with your first project, responsibility, result, or achievement\.)$/i;
  const text = value => String(value || '').replace(/\s+/g, ' ').trim();
  const meaningful = value => {
    const t = text(value);
    return t && !placeholderRx.test(t) ? t : '';
  };
  const clone = data => { try { return JSON.parse(JSON.stringify(data || {})); } catch (_) { return data || {}; } };

  function scrubPlaceholders(data) {
    const d = clone(data || {});
    ['name_th','name_en','role_th','role_en','bio_th','bio_en','skills_th','skills_en','email','phone','linkedin'].forEach(key => {
      if (d[key] && !meaningful(d[key])) d[key] = '';
    });
    if (Array.isArray(d.exp)) {
      d.exp = d.exp.map(item => {
        const next = { ...(item || {}) };
        ['title_th','title_en','company_th','company_en','desc_th','desc_en','title','company','desc'].forEach(key => {
          if (next[key] && !meaningful(next[key])) next[key] = '';
        });
        ['highlights_th','highlights_en','highlights'].forEach(key => {
          if (Array.isArray(next[key])) next[key] = next[key].map(meaningful).filter(Boolean);
          else if (next[key] && !meaningful(next[key])) next[key] = '';
        });
        return next;
      });
    }
    return d;
  }

  function hasUsefulProject(item) {
    if (!item) return false;
    const fields = ['title_th','title_en','company_th','company_en','desc_th','desc_en','title','company','desc'];
    return fields.some(key => meaningful(item[key])) || (Array.isArray(item.images) && item.images.some(Boolean));
  }

  function hasUsefulData(data) {
    if (!data || typeof data !== 'object') return false;
    const d = scrubPlaceholders(data);
    const fields = ['name_th','name_en','role_th','role_en','bio_th','bio_en','skills_th','skills_en','education_th','education_en','certifications_th','certifications_en','awards_th','awards_en','caseStudies_th','caseStudies_en','services_th','services_en','testimonials_th','testimonials_en','clients_th','clients_en','cta_th','cta_en','articles_th','articles_en','email','phone','linkedin','avatar'];
    return fields.some(key => meaningful(d[key])) || (Array.isArray(d.exp) && d.exp.some(hasUsefulProject));
  }

  function mergeUsefulData(primary, fallback) {
    const base = scrubPlaceholders(fallback || {});
    const next = scrubPlaceholders(primary || {});
    Object.keys(next).forEach(key => {
      const value = next[key];
      if (Array.isArray(value)) {
        if (value.length) base[key] = value;
      } else if (value && typeof value === 'object') {
        base[key] = { ...(base[key] || {}), ...value };
      } else if (meaningful(value) || key === 'avatar' || key === 'portfolioStyle' || key === 'layout' || key === 'lang' || key === 'colorMode') {
        if (value !== undefined && value !== null && String(value).length) base[key] = value;
      }
    });
    return base;
  }

  function getCandidateFromLocalStorage() {
    const keys = ['ai-portfolio-pro-cache', 'portfolioData', 'profileData', 'ai-portfolio-data'];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (hasUsefulData(parsed)) return scrubPlaceholders(parsed);
      } catch (_) {}
    }
    return null;
  }

  function getCandidateFromWindow() {
    const names = ['__AI_PORTFOLIO_ACTIVE_DATA', 'INJECTED_PORTFOLIO_DATA', 'ACTIVE_PORTFOLIO_DATA', 'currentData', 'portfolioData', 'profileData'];
    for (const name of names) {
      try {
        const value = window[name];
        if (value && typeof value === 'object' && hasUsefulData(value)) return scrubPlaceholders(value);
      } catch (_) {}
    }
    return null;
  }

  function imageSrc(img) {
    return img ? (img.currentSrc || img.src || img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-full-src') || '') : '';
  }

  function getCandidateFromDom() {
    const app = document.getElementById('app');
    if (!app) return null;
    const header = app.querySelector('header, .portfolio-hero, .resume-cv-sidebar header') || app;
    const name = meaningful((header.querySelector('h1') || app.querySelector('h1') || {}).textContent);
    const role = meaningful((header.querySelector('p, h2, h3') || {}).textContent);
    const avatar = imageSrc(app.querySelector('header img, .hero-avatar img, img.hero-avatar, .resume-cv-sidebar img'));
    const sections = Array.from(app.querySelectorAll('section, .print-order-extra, .resume-section-card'));
    const findSection = regex => sections.find(section => regex.test(text(section.textContent).slice(0, 220)));
    const cleanSection = (section, labels) => {
      if (!section) return '';
      let value = text(section.textContent);
      labels.forEach(label => { value = value.replace(new RegExp('^' + label + '\\s*', 'i'), ''); });
      return meaningful(value);
    };

    const expRoot = app.querySelector('.experience-section') || findSection(/experience|ประสบการณ์|ผลงาน/i);
    const exp = [];
    if (expRoot) {
      const items = Array.from(expRoot.querySelectorAll('.print-exp-item, .scrollytelling-wrapper')).filter((el, idx, arr) => arr.indexOf(el) === idx);
      items.slice(0, 12).forEach((item, index) => {
        const title = meaningful((item.querySelector('h4') || item.querySelector('[data-exp-title]') || item.querySelector('h3') || {}).textContent) || '';
        const company = meaningful((item.querySelector('h5') || item.querySelector('[data-exp-company]') || {}).textContent);
        const desc = meaningful((item.querySelector('p') || item.querySelector('[data-exp-desc]') || {}).textContent);
        const dateText = meaningful((item.querySelector('.font-mono, time, [data-exp-date]') || {}).textContent);
        const images = Array.from(item.querySelectorAll('img')).map(imageSrc).filter(Boolean).filter(src => src !== avatar);
        if (title || company || desc || images.length) {
          exp.push({ title_th: title || `Project ${index + 1}`, title_en: title || `Project ${index + 1}`, company_th: company, company_en: company, desc_th: desc, desc_en: desc, year: dateText, images });
        }
      });
    }

    if (!exp.length) {
      const images = Array.from(app.querySelectorAll('img')).map(imageSrc).filter(Boolean).filter(src => src !== avatar);
      if (images.length) exp.push({ title_th: 'Project Images', title_en: 'Project Images', company_th: '', company_en: '', desc_th: '', desc_en: '', images });
    }

    const data = {
      _fromRenderedDom: true,
      name_th: name,
      name_en: name,
      role_th: role,
      role_en: role,
      bio_th: cleanSection(findSection(/summary|ประวัติโดยย่อ|professional/i), ['Professional Summary', 'Summary', 'ประวัติโดยย่อ']),
      bio_en: cleanSection(findSection(/summary|ประวัติโดยย่อ|professional/i), ['Professional Summary', 'Summary', 'ประวัติโดยย่อ']),
      skills_th: cleanSection(app.querySelector('.skills-section') || findSection(/skills|ทักษะ/i), ['Skills & Expertise', 'Skills', 'ทักษะและความเชี่ยวชาญ', 'ทักษะ']),
      skills_en: cleanSection(app.querySelector('.skills-section') || findSection(/skills|ทักษะ/i), ['Skills & Expertise', 'Skills', 'ทักษะและความเชี่ยวชาญ', 'ทักษะ']),
      avatar,
      exp,
      lang: document.documentElement.lang === 'en' ? 'en' : 'th',
      layout: document.body.classList.contains('layout-resume') ? 'resume' : 'portfolio'
    };
    return hasUsefulData(data) ? scrubPlaceholders(data) : null;
  }

  function resolveActiveData(originalLoad) {
    let stored = null;
    try { stored = originalLoad ? originalLoad() : null; } catch (_) { stored = null; }
    const candidates = [getCandidateFromLocalStorage(), getCandidateFromWindow(), getCandidateFromDom(), stored]
      .filter(hasUsefulData)
      .map(scrubPlaceholders);
    if (candidates.length) {
      return candidates.slice(1).reduce((acc, item) => mergeUsefulData(acc, item), candidates[0]);
    }
    return scrubPlaceholders(stored || getCandidateFromDom() || getCandidateFromWindow() || {});
  }

  function installPatch() {
    if (!window.PrintDesigner || window.PrintDesigner.__activeDataPatchedV43) return false;
    const originalOpen = window.PrintDesigner.open;
    if (typeof originalOpen !== 'function') return false;

    window.PrintDesigner.open = function patchedOpen(mode) {
      const originalLoad = window.StorageHandler && StorageHandler.load;
      const activeData = resolveActiveData(originalLoad);
      if (activeData) window.__AI_PORTFOLIO_ACTIVE_DATA = clone(activeData);

      if (window.StorageHandler && typeof originalLoad === 'function') {
        StorageHandler.load = function loadActiveForPrintDesigner() {
          return clone(activeData || originalLoad());
        };
        try { return originalOpen.call(window.PrintDesigner, mode); }
        finally { StorageHandler.load = originalLoad; }
      }
      return originalOpen.call(window.PrintDesigner, mode);
    };

    window.PrintDesigner.__activeDataPatchedV43 = true;
    return true;
  }

  if (!installPatch()) {
    const timer = setInterval(() => { if (installPatch()) clearInterval(timer); }, 250);
    setTimeout(() => clearInterval(timer), 8000);
  }
})();
