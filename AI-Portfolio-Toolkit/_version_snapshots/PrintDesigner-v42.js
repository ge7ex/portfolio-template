// js/components/PrintDesigner.js
// V38 Interactive Print Designer - studio layout editor + production-themed print renderer
// Print-only composition layer: drag / resize / rotate layout objects without mutating portfolio data.
(function () {
  'use strict';

  const PROFILE_KEY = 'ai-portfolio-print-designer-v36-data1';
  const MM = 3.7795275591;
  const px = mm => Math.round(mm * MM);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const esc = v => String(v || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const uid = () => 'pd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);

  const defaultProfiles = () => ({
    portfolio: { activeProfileId: 'portfolio-balanced', profiles: [{ id: 'portfolio-balanced', name: 'Portfolio Balanced', mode: 'portfolio', orientation: 'portrait', pageScale: 100, snap: true, grid: true, transforms: {} }] },
    resume: { activeProfileId: 'resume-balanced', profiles: [{ id: 'resume-balanced', name: 'Resume Balanced', mode: 'resume', orientation: 'portrait', pageScale: 100, snap: true, grid: true, transforms: {} }] }
  });

  let state = { mode: 'portfolio', data: {}, profiles: defaultProfiles(), selectedId: null, activeProfile: null, action: null, start: null };

  function injectCss() {
    if (document.getElementById('pd-v38-style')) return;
    const style = document.createElement('style');
    style.id = 'pd-v38-style';
    style.textContent = `
      .print-designer-root.hidden{display:none!important}.print-designer-root{position:fixed;inset:0;z-index:300;color:#e5e7eb}.pd-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.92);backdrop-filter:blur(10px)}.pd-shell{position:relative;height:100%;display:flex;flex-direction:column}.pd-topbar{height:76px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px;border-bottom:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.9)}.pd-topbar h2{margin:0;color:#fff;font-size:22px;font-weight:900}.pd-kicker{color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:.18em;font-weight:800}.pd-top-actions{display:flex;gap:8px;flex-wrap:wrap}.pd-top-actions button,.pd-sidebar button{border:1px solid rgba(255,255,255,.14);background:rgba(59,130,246,.18);color:#fff;border-radius:12px;padding:9px 12px;font-weight:800;font-size:12px}.pd-top-actions button:hover,.pd-sidebar button:hover{background:rgba(59,130,246,.34)}.pd-top-actions .pd-danger{background:rgba(244,63,94,.2)}.pd-body{min-height:0;flex:1;display:grid;grid-template-columns:300px 1fr}.pd-sidebar{overflow:auto;padding:16px;border-right:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.95)}.pd-sidebar label{display:block;font-size:12px;color:#cbd5e1;font-weight:800;margin-bottom:14px}.pd-sidebar select,.pd-sidebar input[type=number]{width:100%;margin-top:6px;background:#020617;color:#e5e7eb;border:1px solid rgba(148,163,184,.35);border-radius:10px;padding:8px;outline:none}.pd-sidebar input[type=range]{width:100%;margin-top:8px;accent-color:#22d3ee}.pd-toggle-row{display:flex;gap:12px;margin-bottom:12px}.pd-toggle-row label{display:flex;align-items:center;gap:6px;margin:0}.pd-panel{border:1px solid rgba(148,163,184,.18);background:rgba(30,41,59,.45);border-radius:18px;padding:14px;margin:14px 0}.pd-panel h3{color:#fff;font-size:14px;font-weight:900;margin:0 0 8px}.pd-panel p{color:#cbd5e1;font-size:12px;line-height:1.55;margin:8px 0 0}.pd-control-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.pd-small-actions{display:grid;gap:8px;margin-top:12px}.pd-workspace{overflow:auto;background:radial-gradient(circle at 10% 20%,rgba(59,130,246,.14),transparent 30%),#0f172a;padding:36px}.pd-stage{width:max-content;min-width:100%;min-height:100%;display:flex;align-items:flex-start;justify-content:center;padding:24px}.pd-page{position:relative;background:#fff;color:#0f172a;box-shadow:0 30px 90px rgba(0,0,0,.4);transform-origin:top center;overflow:hidden}.pd-page:before{content:"";position:absolute;inset:0 0 auto 0;height:48mm;background:linear-gradient(135deg,var(--pd-print-bg-1,#172554),var(--pd-print-bg-2,#020617));z-index:0}.pd-page:after{content:"";position:absolute;left:0;right:0;top:47mm;height:1.6mm;background:linear-gradient(90deg,var(--pd-print-accent,#2563eb),var(--pd-print-accent-2,#38bdf8));z-index:0}.pd-page.pd-resume:before{width:78mm;height:100%;right:auto;background:linear-gradient(180deg,var(--pd-print-bg-1,#172554),var(--pd-print-bg-2,#020617))}.pd-page.pd-resume:after{left:78mm;top:0;bottom:0;width:1.6mm;height:auto;right:auto;background:linear-gradient(180deg,var(--pd-print-accent,#2563eb),var(--pd-print-accent-2,#38bdf8))}.pd-page.pd-portrait{width:210mm;min-height:297mm}.pd-page.pd-landscape{width:297mm;min-height:210mm}.pd-page.pd-grid-on{background-image:linear-gradient(rgba(15,23,42,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.06) 1px,transparent 1px);background-size:10mm 10mm}.pd-object{position:absolute;border:1px dashed transparent;user-select:none;touch-action:none;transform-origin:center center}.pd-object:hover{border-color:rgba(14,165,233,.45)}.pd-object.pd-selected{border:2px solid #06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.18)}.pd-object-content{width:100%;height:100%;overflow:hidden;background:rgba(255,255,255,.94);border-radius:8px;padding:10px;box-shadow:0 10px 28px rgba(15,23,42,.10)}.pd-image .pd-object-content{padding:0;background:#f8fafc;border:1px solid rgba(148,163,184,.55);display:flex;align-items:center;justify-content:center}.pd-object img{width:100%;height:100%;object-fit:var(--pd-img-fit,cover);object-position:var(--pd-img-pos-x,50%) var(--pd-img-pos-y,50%);display:block}.pd-template-note{font-size:11px;color:#93c5fd;margin-top:8px}.pd-disabled{opacity:.45;pointer-events:none}.pd-object h1{font-size:30px;line-height:1.05;font-weight:900;margin:0 0 6px;color:#0f172a}.pd-object h2{font-size:18px;line-height:1.15;font-weight:900;margin:0 0 6px;color:#0f766e}.pd-object h3{font-size:13px;line-height:1.2;font-weight:800;margin:0 0 6px;color:#334155}.pd-object p{font-size:12px;line-height:1.45;color:#334155;margin:0}.pd-project-meta{font-size:10px;line-height:1.25;color:#64748b;font-weight:800;margin:0 0 4px}.pd-project-desc{white-space:pre-line}.pd-project-list{margin:6px 0 0 16px;padding:0;color:#334155;font-size:11px;line-height:1.35}.pd-project-list li{margin:0 0 3px}.pd-project .pd-object-content{padding:8px 10px}.pd-resume-avatar{float:left;width:54px!important;height:54px!important;object-fit:cover!important;border-radius:14px;margin:0 10px 6px 0}.pd-object-toolbar{position:absolute;left:0;top:-27px;height:24px;display:none;align-items:center;gap:8px;background:rgba(15,23,42,.92);color:#fff;border-radius:999px;padding:2px 4px 2px 10px;font-size:11px;font-weight:800;white-space:nowrap;z-index:20}.pd-selected .pd-object-toolbar{display:flex}.pd-object-toolbar button{border:0;background:rgba(244,63,94,.8);color:#fff;border-radius:999px;padding:3px 7px;font-size:10px}.pd-handle,.pd-rotate{display:none;position:absolute;width:12px;height:12px;background:#06b6d4;border:2px solid #fff;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.35);z-index:30}.pd-selected .pd-handle,.pd-selected .pd-rotate{display:block}.pd-handle-nw{left:-7px;top:-7px;cursor:nwse-resize}.pd-handle-ne{right:-7px;top:-7px;cursor:nesw-resize}.pd-handle-sw{left:-7px;bottom:-7px;cursor:nesw-resize}.pd-handle-se{right:-7px;bottom:-7px;cursor:nwse-resize}.pd-rotate{left:50%;top:-42px;transform:translateX(-50%);background:#f59e0b;cursor:grab}.pd-rotate:after{content:"";position:absolute;left:50%;top:11px;width:1px;height:28px;background:#f59e0b}.pd-hidden-object{opacity:.18!important;outline:2px dashed #ef4444}#pd-toast{position:fixed;z-index:400;right:24px;bottom:24px;background:rgba(15,23,42,.95);color:#fff;border:1px solid rgba(34,211,238,.5);border-radius:16px;padding:12px 16px;font-weight:800;box-shadow:0 20px 50px rgba(0,0,0,.35)}@media(max-width:900px){.pd-body{grid-template-columns:1fr}.pd-sidebar{max-height:38vh;border-right:0;border-bottom:1px solid rgba(148,163,184,.25)}.pd-workspace{padding:16px}}@media print{body.print-designer-printing>*:not(#print-designer-root){display:none!important}body.print-designer-printing #print-designer-root,body.print-designer-printing .pd-shell,body.print-designer-printing .pd-body,body.print-designer-printing .pd-workspace,body.print-designer-printing .pd-stage{display:block!important;position:static!important;inset:auto!important;width:auto!important;height:auto!important;overflow:visible!important;padding:0!important;margin:0!important;background:#fff!important}body.print-designer-printing .pd-backdrop,body.print-designer-printing .pd-topbar,body.print-designer-printing .pd-sidebar,body.print-designer-printing .no-print,body.print-designer-printing .pd-handle,body.print-designer-printing .pd-rotate,body.print-designer-printing .pd-object-toolbar{display:none!important}body.print-designer-printing .pd-page{transform:none!important;box-shadow:none!important;margin:0!important;overflow:visible!important;page-break-after:auto}body.print-designer-printing .pd-object{border:none!important;box-shadow:none!important}body.print-designer-printing .pd-object-content{border-color:transparent!important}body.print-designer-printing .pd-hidden-object{display:none!important}
        body.print-designer-printing .pd-page{background:radial-gradient(circle at 92% 10%,color-mix(in srgb,var(--pd-print-accent-2,#2dd4bf) 24%,transparent),transparent 30%),radial-gradient(circle at 8% 92%,color-mix(in srgb,var(--pd-print-accent,#0d9488) 24%,transparent),transparent 34%),linear-gradient(135deg,var(--pd-print-bg-1,#115e59),var(--pd-print-bg-2,#042f2e))!important;color:#0f172a!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;box-sizing:border-box!important}
        body.print-designer-printing .pd-page.pd-grid-on{background:radial-gradient(circle at 92% 10%,color-mix(in srgb,var(--pd-print-accent-2,#2dd4bf) 24%,transparent),transparent 30%),radial-gradient(circle at 8% 92%,color-mix(in srgb,var(--pd-print-accent,#0d9488) 24%,transparent),transparent 34%),linear-gradient(135deg,var(--pd-print-bg-1,#115e59),var(--pd-print-bg-2,#042f2e))!important;background-size:auto!important}
        body.print-designer-printing .pd-page.pd-portfolio:before{content:""!important;position:absolute!important;left:9mm!important;right:9mm!important;top:8mm!important;bottom:8mm!important;height:auto!important;width:auto!important;border-radius:7mm!important;background:rgba(255,255,255,.955)!important;border:1.2pt solid color-mix(in srgb,var(--pd-print-accent,#0d9488) 42%,white)!important;box-shadow:0 10mm 22mm rgba(15,23,42,.20)!important;z-index:0!important}
        body.print-designer-printing .pd-page.pd-portfolio:after{content:""!important;display:block!important;position:absolute!important;left:17mm!important;right:17mm!important;top:11mm!important;height:2.5mm!important;border-radius:999px!important;background:linear-gradient(90deg,var(--pd-print-accent,#0d9488),var(--pd-print-accent-2,#2dd4bf))!important;z-index:0!important}
        body.print-designer-printing .pd-page.pd-resume:before{content:""!important;position:absolute!important;left:0!important;top:0!important;bottom:0!important;width:78mm!important;height:auto!important;background:linear-gradient(165deg,var(--pd-print-bg-1,#0f766e),var(--pd-print-bg-2,#0f172a))!important;z-index:0!important}
        body.print-designer-printing .pd-page.pd-resume:after{content:""!important;position:absolute!important;left:78mm!important;top:0!important;bottom:0!important;width:1.6mm!important;height:auto!important;background:linear-gradient(180deg,var(--pd-print-accent,#0d9488),var(--pd-print-accent-2,#2dd4bf))!important;z-index:0!important}
        body.print-designer-printing .pd-object[data-pd-id=header] .pd-object-content{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
        body.print-designer-printing .pd-object[data-pd-id=header] h1{color:var(--pd-print-accent,#0f766e)!important}
        body.print-designer-printing .pd-object[data-pd-id=header] h3{color:#334155!important}
        body.print-designer-printing .pd-section-heading .pd-object-content{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0 8px!important}
        body.print-designer-printing .pd-section-heading h2{color:var(--pd-print-accent,#0f766e)!important;border-bottom:1.8pt solid var(--pd-print-accent,#0f766e)!important;padding-bottom:2mm!important;margin:0!important}
        body.print-designer-printing .pd-object{z-index:2}.pd-page .pd-object{z-index:1}
        body.print-designer-printing .pd-object-content{background:rgba(255,255,255,.96)!important;border:1px solid color-mix(in srgb,var(--pd-print-accent,#0d9488) 35%,rgba(15,23,42,.08))!important;border-radius:14px!important;box-shadow:none!important;color:#0f172a!important}
        body.print-designer-printing .pd-image .pd-object-content{padding:0!important;background:#fff!important;overflow:hidden!important}
        body.print-designer-printing .pd-object h1{color:var(--pd-print-accent,#0f766e)!important;font-size:30px!important;line-height:1.05!important;margin:0 0 8px!important}
        body.print-designer-printing .pd-object h2{color:var(--pd-print-accent,#0f766e)!important;border-bottom:1.2mm solid var(--pd-print-accent,#0f766e)!important;padding-bottom:2mm!important;margin:0 0 4mm!important}
        body.print-designer-printing .pd-object h3{color:#475569!important}
        body.print-designer-printing .pd-object p{color:#334155!important;white-space:pre-line!important}body.print-designer-printing .pd-project .pd-object-content{overflow:visible!important;padding:6px 8px!important}body.print-designer-printing .pd-project .pd-project-meta{font-size:8.5pt!important;line-height:1.2!important;color:#64748b!important;font-weight:800!important;margin:0 0 2mm!important}body.print-designer-printing .pd-project h2{font-size:15pt!important;line-height:1.1!important;border-bottom:0!important;padding-bottom:0!important;margin:0 0 1.5mm!important;color:var(--pd-print-accent,#0f766e)!important}body.print-designer-printing .pd-project h3{font-size:10pt!important;line-height:1.25!important;margin:0 0 1.5mm!important;color:#475569!important}body.print-designer-printing .pd-project .pd-project-desc{font-size:9pt!important;line-height:1.35!important;margin:0 0 1.5mm!important;color:#334155!important;white-space:pre-line!important}body.print-designer-printing .pd-project .pd-project-list{font-size:8.5pt!important;line-height:1.3!important;margin:1mm 0 0 4mm!important;padding:0!important;color:#334155!important}body.print-designer-printing .pd-project .pd-project-list li{margin:0 0 .8mm!important}
        body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=header] .pd-object-content,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=skills] .pd-object-content,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=contact] .pd-object-content{background:transparent!important;border-color:transparent!important;color:white!important}
        body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=header] h1,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=header] h3,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=skills] h2,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=skills] p,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=contact] h2,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=contact] p{color:white!important}
        body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=skills] h2,body.print-designer-printing .pd-page.pd-resume .pd-object[data-pd-id=contact] h2{border-bottom-color:rgba(255,255,255,.5)!important}
      }
    `;
    style.textContent += `
      .pd-object[data-pd-id="header"] .pd-object-content{background:transparent!important;border-color:transparent!important;box-shadow:none!important;padding:0 8px!important}
      .pd-object[data-pd-id="header"].pd-selected .pd-object-content{background:rgba(15,23,42,.14)!important;border:1px dashed rgba(255,255,255,.32)!important;border-radius:12px!important}
      .pd-object[data-pd-id="header"] h1{color:#fff!important;text-shadow:0 2px 14px rgba(0,0,0,.45)!important}
      .pd-object[data-pd-id="header"] h3{color:#dbeafe!important;text-shadow:0 1px 8px rgba(0,0,0,.35)!important}
      @media print{body.print-designer-printing .pd-object[data-pd-id="header"] .pd-object-content{background:transparent!important;border-color:transparent!important;box-shadow:none!important;padding:0 8px!important}body.print-designer-printing .pd-object[data-pd-id="header"] h1{color:#fff!important;text-shadow:none!important}body.print-designer-printing .pd-object[data-pd-id="header"] h3{color:#dbeafe!important;text-shadow:none!important;border-bottom:0!important;padding-bottom:0!important}}
    `;
    document.head.appendChild(style);
  }

  function loadProfiles() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || defaultProfiles(); } catch { return defaultProfiles(); } }
  function saveProfiles() { localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profiles)); toast('Print profile saved'); }
  function modeStore() { const d = defaultProfiles(); state.profiles[state.mode] ||= d[state.mode]; return state.profiles[state.mode]; }
  function activeProfile() { const store = modeStore(); let p = store.profiles.find(x => x.id === store.activeProfileId) || store.profiles[0]; store.activeProfileId = p.id; p.transforms ||= {}; state.activeProfile = p; return p; }
  function meaningfulText(value) {
    const text = String(value || '').trim();
    return /^(Your Portfolio|Portfolio Template|Your Name|hello@example\.com|\+66 00 000 0000|linkedin\.com\/in\/your-profile|Portfolio, Resume, Projects, Skills, Contact|Add your name, role, summary, skills, and project work to turn this template into a finished portfolio\.|Featured project placeholder|Your work or organization|Replace this block with your first project, responsibility, result, or achievement\.)$/i.test(text) ? '' : text;
  }
  function localText(thValue, enValue) {
    const th = meaningfulText(thValue);
    const en = meaningfulText(enValue);
    return state.data && state.data.lang === 'en' ? (en || th) : (th || en);
  }
  function getTextData() {
    const d = state.data || {};
    return {
      name: localText(d.name_th, d.name_en),
      role: localText(d.role_th, d.role_en),
      bio: localText(d.bio_th, d.bio_en),
      skills: localText(d.skills_th, d.skills_en)
    };
  }
  function toast(msg) { const old = document.getElementById('pd-toast'); if (old) old.remove(); const t = document.createElement('div'); t.id = 'pd-toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }

  function clone(data) {
    try { return JSON.parse(JSON.stringify(data || {})); } catch (_) { return data || {}; }
  }

  function field(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function hasRealData(data) {
    if (!data) return false;
    const keys = ['name_th', 'name_en', 'role_th', 'role_en', 'bio_th', 'bio_en', 'skills_th', 'skills_en', 'email', 'phone', 'linkedin', 'avatar'];
    const hasProfile = keys.some(key => meaningfulText(data[key]));
    const hasExp = Array.isArray(data.exp) && data.exp.some(item =>
      ['title_th', 'title_en', 'company_th', 'company_en', 'desc_th', 'desc_en', 'title', 'company', 'desc']
        .some(key => meaningfulText(item && item[key])) ||
      (Array.isArray(item.images) && item.images.some(Boolean))
    );
    return hasProfile || hasExp;
  }

  function dataFromEditForm() {
    if (!document.getElementById('in-name-th') && !document.getElementById('in-name-en')) return null;
    const stored = window.StorageHandler && StorageHandler.load ? StorageHandler.load() : {};
    const formDraft = {
      name_th: field('in-name-th'),
      name_en: field('in-name-en'),
      role_th: field('in-role-th'),
      role_en: field('in-role-en'),
      bio_th: field('in-bio-th'),
      bio_en: field('in-bio-en'),
      skills_th: field('in-skills-th'),
      skills_en: field('in-skills-en'),
      email: field('in-email'),
      phone: field('in-phone'),
      linkedin: field('in-linkedin'),
      education_th: field('in-education-th'),
      education_en: field('in-education-en'),
      certifications_th: field('in-certifications-th'),
      certifications_en: field('in-certifications-en'),
      awards_th: field('in-awards-th'),
      awards_en: field('in-awards-en'),
      caseStudies_th: field('in-caseStudies-th'),
      caseStudies_en: field('in-caseStudies-en'),
      services_th: field('in-services-th'),
      services_en: field('in-services-en'),
      testimonials_th: field('in-testimonials-th'),
      testimonials_en: field('in-testimonials-en'),
      clients_th: field('in-clients-th'),
      clients_en: field('in-clients-en'),
      cta_th: field('in-cta-th'),
      cta_en: field('in-cta-en'),
      articles_th: field('in-articles-th'),
      articles_en: field('in-articles-en')
    };
    const draft = mergeUsefulData(formDraft, stored);
    return hasRealData(draft) && !isDemoData(draft) ? normalizeExpImages(draft) : null;
  }

  function imageSrc(img) {
    if (!img) return '';
    return img.currentSrc || img.src || img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-full-src') || '';
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
      } else if (meaningfulText(value)) {
        base[key] = value;
      }
    });
    return base;
  }

  function isDemoData(data) {
    if (!data) return true;
    const hasExp = Array.isArray(data.exp) && data.exp.some(item => {
      if (!item) return false;
      const hasTextFields = ['title_th','title_en','company_th','company_en','desc_th','desc_en','title','company','desc']
        .some(key => meaningfulText(item[key]));
      const hasImages = Array.isArray(item.images) && item.images.some(Boolean);
      return hasTextFields || hasImages;
    });
    const hasProfile = ['name_th','name_en','role_th','role_en','bio_th','bio_en','skills_th','skills_en','email','phone','linkedin','avatar']
      .some(key => meaningfulText(data[key]));
    if (hasExp || hasProfile) return false;
    const marker = `${data.name_th || ''} ${data.name_en || ''} ${data.role_th || ''} ${data.role_en || ''} ${data.bio_th || ''} ${data.bio_en || ''}`;
    return !!data._isFirstRunDemo || /Your Portfolio|Portfolio Template|Your Name|Add your name, role, summary/i.test(marker);
  }

  function normalizeExpImages(data) {
    if (!data || !Array.isArray(data.exp)) return data;
    data.exp = data.exp.map(item => ({
      ...item,
      images: Array.isArray(item.images) ? item.images.filter(Boolean) : []
    }));
    return data;
  }

  function dataFromRenderedPage() {
    const app = document.getElementById('app');
    if (!app) return null;
    const header = app.querySelector('header, .portfolio-hero, .resume-cv-sidebar header') || app;
    const h1 = header.querySelector('h1') || app.querySelector('h1');
    const roleEl = header.querySelector('p, h2, h3');
    const avatar = imageSrc(app.querySelector('header img, .hero-avatar img, img.hero-avatar, .resume-cv-sidebar img'));
    const d = {
      ...(window.StorageHandler && StorageHandler.load ? StorageHandler.load() : {}),
      name_th: meaningfulText(h1 && h1.textContent),
      name_en: meaningfulText(h1 && h1.textContent),
      role_th: meaningfulText(roleEl && roleEl.textContent),
      role_en: meaningfulText(roleEl && roleEl.textContent),
      avatar
    };
    const expRoot = app.querySelector('.experience-section');
    if (expRoot) {
      const items = Array.from(expRoot.querySelectorAll('.print-exp-item'));
      d.exp = items.map((item, index) => {
        const title = meaningfulText((item.querySelector('h4, h2, h3') || {}).textContent) || `Project ${index + 1}`;
        const company = meaningfulText((item.querySelector('h5') || {}).textContent);
        const desc = meaningfulText((item.querySelector('p') || {}).textContent);
        const images = Array.from(item.querySelectorAll('img')).map(imageSrc).filter(Boolean).filter(src => src !== avatar);
        return { title_th: title, title_en: title, company_th: company, company_en: company, desc_th: desc, desc_en: desc, images };
      }).filter(item => item.title_th || item.company_th || item.desc_th || item.images.length);
    }
    const sections = Array.from(app.querySelectorAll('section, .print-order-extra, .resume-section-card'));
    const sectionText = (patterns, removePatterns = patterns) => {
      const section = sections.find(sec => patterns.some(rx => rx.test(meaningfulText(sec.textContent).slice(0, 180))));
      if (!section) return '';
      let text = meaningfulText(section.textContent).replace(/\s+/g, ' ').trim();
      removePatterns.forEach(rx => { text = text.replace(rx, '').trim(); });
      return text;
    };
    d.education_th ||= sectionText([/การศึกษา|Education/i], [/^การศึกษา/i, /^Education/i]);
    d.education_en ||= d.education_th;
    d.certifications_th ||= sectionText([/ประกาศนียบัตร|Certifications/i], [/^ประกาศนียบัตร/i, /^Certifications/i]);
    d.certifications_en ||= d.certifications_th;
    d.awards_th ||= sectionText([/รางวัล|Awards/i], [/^รางวัล(และความสำเร็จ)?/i, /^Awards/i]);
    d.awards_en ||= d.awards_th;
    d.services_th ||= sectionText([/บริการ|Services/i], [/^บริการ/i, /^Services/i]);
    d.services_en ||= d.services_th;
    d.clients_th ||= sectionText([/ลูกค้า|Clients|Partners/i], [/^ลูกค้า( \/ หน่วยงาน)?/i, /^Clients( \/ Partners)?/i]);
    d.clients_en ||= d.clients_th;
    d.articles_th ||= sectionText([/บทความ|Articles|Publications/i], [/^บทความ( \/ สื่อเผยแพร่)?/i, /^Articles( \/ Publications)?/i]);
    d.articles_en ||= d.articles_th;
    d.cta_th ||= sectionText([/คำเชิญชวน|CTA|ติดต่อ/i], [/^คำเชิญชวน/i, /^CTA/i]);
    d.cta_en ||= d.cta_th;
    return hasRealData(d) ? d : null;
  }

  function dataFromLocalStorageCache() {
    const keys = ['ai-portfolio-pro-cache', 'portfolioData', 'profileData', 'ai-portfolio-data'];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && hasRealData(parsed)) return parsed;
      } catch (_) {}
    }
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!/portfolio|profile/i.test(key || '')) continue;
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed && typeof parsed === 'object' && hasRealData(parsed)) return parsed;
      }
    } catch (_) {}
    return null;
  }

  function dataFromWindowCandidates() {
    const names = ['__AI_PORTFOLIO_ACTIVE_DATA', 'INJECTED_PORTFOLIO_DATA', 'ACTIVE_PORTFOLIO_DATA', 'currentData', 'portfolioData', 'profileData'];
    for (const name of names) {
      try {
        const value = window[name];
        if (value && typeof value === 'object' && hasRealData(value)) return value;
      } catch (_) {}
    }
    return null;
  }

  function resolvePrintData() {
    const stored = window.StorageHandler && StorageHandler.load ? StorageHandler.load() : null;
    const candidates = [
      dataFromEditForm(),
      dataFromWindowCandidates(),
      dataFromLocalStorageCache(),
      dataFromRenderedPage(),
      stored
    ];
    const real = candidates
      .map(item => item ? normalizeExpImages(clone(item)) : null)
      .filter(item => hasRealData(item) && !isDemoData(item));
    if (real.length) {
      return real.slice(1).reduce((acc, item) => mergeUsefulData(acc, item), real[0]);
    }
    return normalizeExpImages(stored || {});
  }

  function shell() {
    injectCss();
    if (document.getElementById('print-designer-root')) return;
    const root = document.createElement('div'); root.id = 'print-designer-root'; root.className = 'print-designer-root hidden';
    root.innerHTML = `<div class="pd-backdrop"></div><div class="pd-shell" role="dialog" aria-modal="true" aria-label="PDF Layout Studio"><div class="pd-topbar no-print"><div><div class="pd-kicker">V38 Print Template Studio</div><h2>PDF Layout Studio</h2></div><div class="pd-top-actions"><button id="pd-dup" type="button">Duplicate Profile</button><button id="pd-save" type="button">Save Print Profile</button><button id="pd-print" type="button">Print PDF</button><button id="pd-reset" class="pd-danger" type="button">Reset Layout</button><button id="pd-close" type="button">Exit</button></div></div><div class="pd-body"><aside class="pd-sidebar no-print"><div class="pd-panel"><h3>Mode</h3><div class="pd-toggle-row"><label><input type="radio" name="pd-mode" value="portfolio"> Portfolio</label><label><input type="radio" name="pd-mode" value="resume"> Resume</label></div><label>Profile<select id="pd-profile"></select></label><label>Orientation<select id="pd-orientation"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label>Page Scale <span id="pd-scale-label"></span><input id="pd-scale" type="range" min="70" max="130" step="5"></label><div class="pd-toggle-row"><label><input id="pd-snap" type="checkbox"> Snap</label><label><input id="pd-grid" type="checkbox"> Grid</label></div><p>Studio นี้แก้ layout บน print template พร้อมธีมปัจจุบัน ไม่สร้าง whiteboard ใหม่ และไม่แก้ข้อมูล Portfolio/Resume หลัก</p><p class="pd-template-note">ธีมจากหน้าเว็บจะถูกใช้กับพื้นหลัง/เส้น accent ตอน Preview และ Print</p></div><div class="pd-panel"><h3>Selected Object</h3><div class="pd-control-grid"><label>X<input id="pd-x" type="number"></label><label>Y<input id="pd-y" type="number"></label><label>W<input id="pd-w" type="number"></label><label>H<input id="pd-h" type="number"></label><label>Rotate<input id="pd-r" type="number"></label><label>Layer<input id="pd-z" type="number"></label></div><div class="pd-small-actions"><button id="pd-hide" type="button">Hide / Show</button><button id="pd-front" type="button">Bring Forward</button><button id="pd-back" type="button">Send Backward</button></div></div><div id="pd-image-panel" class="pd-panel pd-disabled"><h3>Image Crop / Resize</h3><label>Fit Mode<select id="pd-img-fit"><option value="cover">Crop เต็มกรอบ</option><option value="contain">Resize เห็นทั้งรูป</option><option value="fill">ยืดเต็มกรอบ</option></select></label><label>Horizontal Position <span id="pd-img-x-label"></span><input id="pd-img-x" type="range" min="0" max="100" step="1"></label><label>Vertical Position <span id="pd-img-y-label"></span><input id="pd-img-y" type="range" min="0" max="100" step="1"></label><div class="pd-small-actions"><button id="pd-img-landscape" type="button">Fit Landscape</button><button id="pd-img-portrait" type="button">Fit Portrait</button><button id="pd-img-reset" type="button">Reset Image Fit</button></div><p>ใช้ปรับรูปแนวนอน/แนวตั้งในกรอบก่อนสั่งพิมพ์ โดยไม่แก้ไฟล์รูปต้นฉบับ</p></div></aside><main class="pd-workspace"><div class="pd-stage"><div id="pd-page" class="pd-page"></div></div></main></div></div>`;
    document.body.appendChild(root);
    bindUi();
  }

  function bindUi() {
    document.getElementById('pd-close').onclick = close;
    document.getElementById('pd-save').onclick = () => { saveSelected(); saveProfiles(); };
    document.getElementById('pd-print').onclick = printPdf;
    document.getElementById('pd-reset').onclick = () => { if (confirm('Reset this print layout?')) { activeProfile().transforms = {}; render(); } };
    document.getElementById('pd-dup').onclick = duplicateProfile;
    document.querySelectorAll('input[name="pd-mode"]').forEach(i => i.onchange = () => { saveSelected(); state.mode = i.value; render(); });
    document.getElementById('pd-profile').onchange = e => { saveSelected(); modeStore().activeProfileId = e.target.value; render(); };
    document.getElementById('pd-orientation').onchange = e => { activeProfile().orientation = e.target.value; render(); };
    document.getElementById('pd-scale').oninput = e => { activeProfile().pageScale = Number(e.target.value); document.getElementById('pd-scale-label').textContent = e.target.value + '%'; applyPage(); };
    document.getElementById('pd-snap').onchange = e => { activeProfile().snap = e.target.checked; };
    document.getElementById('pd-grid').onchange = e => { activeProfile().grid = e.target.checked; applyPage(); };
    ['x','y','w','h','r','z'].forEach(k => document.getElementById('pd-' + k).oninput = updateSelectedFromPanel);
    ['pd-img-fit','pd-img-x','pd-img-y'].forEach(id => { const i = document.getElementById(id); if (i) i.oninput = updateImageFitFromPanel; });
    document.getElementById('pd-img-landscape').onclick = () => { const el = selected(); if (!el) return; setBox(el, { ...box(el), w: Math.max(box(el).w, 70), h: Math.min(box(el).h, 45) }); setImageFit(el, 'cover', 50, 50); };
    document.getElementById('pd-img-portrait').onclick = () => { const el = selected(); if (!el) return; setBox(el, { ...box(el), w: Math.min(box(el).w, 48), h: Math.max(box(el).h, 70) }); setImageFit(el, 'cover', 50, 50); };
    document.getElementById('pd-img-reset').onclick = () => { const el = selected(); if (!el) return; setImageFit(el, 'cover', 50, 50); };
    document.getElementById('pd-hide').onclick = () => { const el = selected(); if (!el) return; el.classList.toggle('pd-hidden-object'); saveSelected(); };
    document.getElementById('pd-front').onclick = () => { const el = selected(); if (!el) return; el.style.zIndex = Number(el.style.zIndex || 1) + 1; saveSelected(); syncPanel(); };
    document.getElementById('pd-back').onclick = () => { const el = selected(); if (!el) return; el.style.zIndex = Math.max(1, Number(el.style.zIndex || 1) - 1); saveSelected(); syncPanel(); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  function duplicateProfile() { const old = activeProfile(); const copy = JSON.parse(JSON.stringify(old)); copy.id = uid(); copy.name = prompt('Profile name', old.name + ' Copy') || (old.name + ' Copy'); modeStore().profiles.push(copy); modeStore().activeProfileId = copy.id; render(); toast('Profile duplicated'); }

  const THEME_PRINT_VARS = {
    tech: ['#172554', '#020617', '#2563eb', '#38bdf8'],
    educ: ['#064e3b', '#022c22', '#059669', '#34d399'],
    gov: ['#78350f', '#0f172a', '#d97706', '#fbbf24'],
    creative: ['#581c87', '#2e1065', '#c026d3', '#f0abfc'],
    minimal: ['#111827', '#000000', '#334155', '#94a3b8'],
    eco: ['#115e59', '#042f2e', '#0d9488', '#2dd4bf'],
    bold: ['#7f1d1d', '#450a0a', '#e11d48', '#fb7185'],
    luxury: ['#312e81', '#111827', '#b45309', '#fbbf24'],
    health: ['#062b33', '#042f2e', '#22d3ee', '#10b981'],
    esports: ['#160b35', '#020617', '#8b5cf6', '#22d3ee']
  };
  function activePrintThemeVars() {
    const theme = (state.data && state.data.portfolioStyle) || (window.StorageHandler && StorageHandler.load ? (StorageHandler.load().portfolioStyle || '') : '') || 'tech';
    return THEME_PRINT_VARS[theme] || THEME_PRINT_VARS.tech;
  }
  function readCssVar(name, fallback) { const v = getComputedStyle(document.body).getPropertyValue(name).trim(); return v || fallback; }
  function applyPage() {
    const p = activeProfile();
    const page = document.getElementById('pd-page');
    const [bg1, bg2, accent, accent2] = activePrintThemeVars();
    page.className = `pd-page pd-${state.mode} pd-${p.orientation} ${p.grid ? 'pd-grid-on' : ''}`;
    page.style.transform = `scale(${(p.pageScale || 100) / 100})`;
    page.style.setProperty('--pd-print-bg-1', readCssVar('--print-bg-1', readCssVar('--resume-sidebar-1', bg1)) || bg1);
    page.style.setProperty('--pd-print-bg-2', readCssVar('--print-bg-2', readCssVar('--resume-sidebar-3', bg2)) || bg2);
    page.style.setProperty('--pd-print-accent', readCssVar('--print-accent', readCssVar('--theme-accent', accent)) || accent);
    page.style.setProperty('--pd-print-accent-2', readCssVar('--print-accent-2', readCssVar('--theme-accent-2', accent2)) || accent2);
    document.getElementById('pd-scale-label').textContent = (p.pageScale || 100) + '%';
  }

  function baseBoxes() {
    const d = state.data || {}, t = getTextData(), exp = Array.isArray(d.exp) ? d.exp : [], out = [];
    const th = d.lang === 'th';
    const pageW = activeProfile().orientation === 'landscape' ? 297 : 210;
    const margin = 12;
    const gap = 7;
    const contentW = pageW - margin * 2;
    const rightColX = state.mode === 'resume' ? 92 : margin;
    const rightColW = state.mode === 'resume' ? contentW - 80 : contentW;
    const presentText = th ? 'ปัจจุบัน' : 'Present';
    const text = (thVal, enVal, fallback = '') => th ? (meaningfulText(thVal) || meaningfulText(enVal) || meaningfulText(fallback)) : (meaningfulText(enVal) || meaningfulText(thVal) || meaningfulText(fallback));
    const hasText = value => String(value || '').trim().length > 0;
    const splitLines = value => {
      if (Array.isArray(value)) return value.map(meaningfulText).filter(Boolean);
      return String(value || '').split(/\r?\n|;|•/).map(meaningfulText).filter(Boolean);
    };
    const localArray = (item, key) => {
      const first = th ? (item[key + '_th'] || item[key + '_en'] || item[key]) : (item[key + '_en'] || item[key + '_th'] || item[key]);
      return splitLines(first);
    };
    const formatYear = value => {
      const raw = meaningfulText(value);
      if (!raw) return '';
      const y = parseInt(raw, 10);
      if (Number.isNaN(y)) return raw;
      if (th && y < 2500) return String(y + 543);
      if (!th && y >= 2500) return String(y - 543);
      return String(y);
    };
    const expDate = item => {
      const sm = meaningfulText(item.startMonth);
      const sy = formatYear(item.startYear || item.year);
      const start = [sm, sy].filter(Boolean).join(' ');
      const em = meaningfulText(item.endMonth);
      const ey = formatYear(item.endYear);
      const end = item.isCurrent ? presentText : [em, ey].filter(Boolean).join(' ');
      return start && end ? `${start} - ${end}` : (start || end || '');
    };
    const textHeight = (body, base = 24, perLine = 92, lineMm = 4.4, max = 72) => {
      const raw = String(body || '');
      const explicit = raw.split(/\r?\n/).length - 1;
      const wrapped = Math.ceil(raw.length / perLine);
      return Math.max(base, Math.min(max, base + Math.max(explicit, wrapped) * lineMm));
    };
    const addText = (id, title, body, x, y, w, h, z = 1) => {
      if (!hasText(body)) return y;
      const minH = Math.max(h, textHeight(body, Math.min(22, h), 110, 4, 80));
      out.push({ id, type: 'text', x, y, w, h: minH, minH, z, html: `<h2>${esc(title)}</h2><p>${esc(body)}</p>` });
      return y + minH + gap;
    };

    out.push({ id: 'header', type: 'text', x: margin, y: margin, w: d.avatar ? contentW - 48 : contentW, h: 34, minH: 34, z: 3, html: `<h1 style="color:#fff">${esc(t.name || '')}</h1><h3 style="color:#dbeafe">${esc(t.role || '')}</h3>` });
    if (d.avatar) out.push({ id: 'avatar', type: 'image', x: pageW - margin - 36, y: margin, w: 36, h: 36, z: 2, src: d.avatar });

    let y = margin + 44;
    y = addText('bio', th ? 'ประวัติโดยย่อ' : 'Summary', t.bio || '', margin, y, contentW, 30);
    if (t.skills) y = addText('skills', th ? 'ทักษะและความเชี่ยวชาญ' : 'Skills', t.skills, margin, y, state.mode === 'resume' ? 68 : contentW, 24);
    if (d.email || d.phone || d.linkedin) {
      y = addText('contact', th ? 'ข้อมูลติดต่อ' : 'Contact', [d.email, d.phone, d.linkedin].filter(Boolean).join('\n'), state.mode === 'resume' ? margin : margin, y, state.mode === 'resume' ? 68 : contentW, 28);
    }

    if (state.mode === 'resume') y = margin + 44;
    if (exp.length) {
      out.push({ id: 'experience-heading', type: 'section-heading', x: rightColX, y, w: rightColW, h: 12, minH: 12, z: 1, html: `<h2>${esc(th ? 'ประสบการณ์และผลงาน' : 'Experience & Projects')}</h2>` });
      y += 17;
    }
    exp.forEach((e, i) => {
      const title = text(e.title_th, e.title_en, e.title || 'Project');
      const company = text(e.company_th, e.company_en, e.company || '');
      const desc = text(e.desc_th, e.desc_en, e.desc || '');
      const highlights = localArray(e, 'highlights');
      const dateDisplay = expDate(e);
      const images = Array.isArray(e.images) ? e.images.filter(Boolean) : [];
      const listHtml = highlights.length ? `<ul class="pd-project-list">${highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : '';
      const descHtml = desc ? `<p class="pd-project-desc">${esc(desc)}</p>` : '';
      const dateHtml = dateDisplay ? `<div class="pd-project-meta">${esc(dateDisplay)}</div>` : '';
      const companyHtml = company ? `<h3>${esc(company)}</h3>` : '';
      const projectBodyForHeight = [dateDisplay, title, company, desc, highlights.join('\n')].filter(Boolean).join('\n');
      const textH = Math.max(34, textHeight(projectBodyForHeight, 28, 72, 4.8, 96) + Math.min(highlights.length * 1.8, 12));
      out.push({
        id: `project-${i + 1}`,
        type: 'text',
        role: 'project',
        x: rightColX,
        y,
        w: rightColW,
        h: textH,
        minH: textH,
        z: 1,
        html: `<div class="pd-project-text">${dateHtml}<h2>${esc(title)}</h2>${companyHtml}${descHtml}${listHtml}</div>`
      });
      y += textH + 5;
      if (state.mode === 'portfolio' && images.length) {
        const cols = images.length >= 5 ? 3 : (images.length === 1 ? 1 : 2);
        const imgW = cols === 1 ? Math.min(120, rightColW) : (rightColW - (cols - 1) * 6) / cols;
        const imgH = images.length >= 5 ? 31 : (images.length === 1 ? 58 : 44);
        images.forEach((src, j) => {
          out.push({ id: `project-${i + 1}-image-${j + 1}`, type: 'image', x: rightColX + (j % cols) * (imgW + 6), y: y + Math.floor(j / cols) * (imgH + 5), w: imgW, h: imgH, z: 2, src });
        });
        y += Math.ceil(images.length / cols) * (imgH + 5);
      }
      y += gap;
    });

    [
      ['education', th ? 'การศึกษา' : 'Education', text(d.education_th, d.education_en)],
      ['certifications', th ? 'ประกาศนียบัตร' : 'Certifications', text(d.certifications_th, d.certifications_en)],
      ['awards', th ? 'รางวัล' : 'Awards', text(d.awards_th, d.awards_en)],
      ['case-studies', th ? 'กรณีศึกษา' : 'Case Studies', text(d.caseStudies_th, d.caseStudies_en)],
      ['services', th ? 'บริการ' : 'Services', text(d.services_th, d.services_en)],
      ['testimonials', th ? 'คำรับรอง' : 'Testimonials', text(d.testimonials_th, d.testimonials_en)],
      ['clients', th ? 'ลูกค้า' : 'Clients', text(d.clients_th, d.clients_en)],
      ['articles', th ? 'บทความ' : 'Articles', text(d.articles_th, d.articles_en)],
      ['cta', th ? 'คำเชิญชวน' : 'CTA', text(d.cta_th, d.cta_en)]
    ].forEach(([id, title, body]) => {
      y = addText(id, title, body, rightColX, y, rightColW, Math.max(24, Math.min(54, 20 + Math.ceil(String(body || '').length / 180) * 8)));
    });
    return out;
  }

  function render() {
    const p = activeProfile(), store = modeStore();
    document.querySelectorAll('input[name="pd-mode"]').forEach(i => { i.checked = i.value === state.mode; });
    const sel = document.getElementById('pd-profile'); sel.innerHTML = store.profiles.map(pr => `<option value="${esc(pr.id)}">${esc(pr.name)}</option>`).join(''); sel.value = store.activeProfileId;
    document.getElementById('pd-orientation').value = p.orientation; document.getElementById('pd-scale').value = p.pageScale || 100; document.getElementById('pd-snap').checked = !!p.snap; document.getElementById('pd-grid').checked = !!p.grid;
    const page = document.getElementById('pd-page'); applyPage(); page.innerHTML = '';
    const boxes = baseBoxes();
    const minPageH = p.orientation === 'landscape' ? 210 : 297;
    page.style.minHeight = Math.ceil(boxes.reduce((max, b) => Math.max(max, (b.y || 0) + (b.h || 0) + 12), minPageH)) + 'mm';
    boxes.forEach(b => { const merged = { ...b, ...(p.transforms[b.id] || {}) }; if (b.minH && (!merged.h || merged.h < b.minH)) merged.h = b.minH; page.appendChild(makeObject(merged)); });
    ensureTextVisibleForPrint(page);
    state.selectedId = null; syncPanel();
  }

  function makeObject(b) {
    const el = document.createElement('div'); el.className = `pd-object pd-${b.type}${b.type === 'section-heading' ? ' pd-section-heading' : ''}${b.role === 'project' ? ' pd-project' : ''}${b.hidden ? ' pd-hidden-object' : ''}`; el.dataset.pdId = b.id; el.dataset.pdType = b.type; if (b.role) el.dataset.pdRole = b.role;
    el.style.left = (b.x || 0) + 'mm'; el.style.top = (b.y || 0) + 'mm'; el.style.width = (b.w || 40) + 'mm'; el.style.height = (b.h || 20) + 'mm'; el.style.zIndex = b.z || 1; el.style.transform = `rotate(${b.r || 0}deg)`; if (b.type === 'image') { el.dataset.imgFit = b.fit || 'cover'; el.dataset.imgX = b.posX == null ? 50 : b.posX; el.dataset.imgY = b.posY == null ? 50 : b.posY; el.style.setProperty('--pd-img-fit', el.dataset.imgFit); el.style.setProperty('--pd-img-pos-x', el.dataset.imgX + '%'); el.style.setProperty('--pd-img-pos-y', el.dataset.imgY + '%'); }
    el.innerHTML = `<div class="pd-object-toolbar"><span>${esc(b.id)}</span><button type="button">hide</button></div><div class="pd-object-content">${b.type === 'image' ? `<img src="${b.src}" alt="">` : (b.html || '')}</div><span class="pd-handle pd-handle-nw" data-h="nw"></span><span class="pd-handle pd-handle-ne" data-h="ne"></span><span class="pd-handle pd-handle-sw" data-h="sw"></span><span class="pd-handle pd-handle-se" data-h="se"></span><span class="pd-rotate" data-rotate="1"></span>`;
    el.addEventListener('pointerdown', down); el.querySelector('.pd-object-toolbar button').onclick = ev => { ev.stopPropagation(); el.classList.toggle('pd-hidden-object'); saveSelected(); };
    return el;
  }

  function selected() { return state.selectedId ? document.querySelector(`[data-pd-id="${CSS.escape(state.selectedId)}"]`) : null; }
  function select(el) { document.querySelectorAll('.pd-object').forEach(o => o.classList.remove('pd-selected')); state.selectedId = el ? el.dataset.pdId : null; if (el) el.classList.add('pd-selected'); syncPanel(); }
  function num(v) { return Number(String(v || '').replace('mm', '').replace('px', '')) || 0; }
  function box(el) { const b = { x: num(el.style.left), y: num(el.style.top), w: num(el.style.width), h: num(el.style.height), r: Number((el.style.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/) || [0, 0])[1]), z: Number(el.style.zIndex || 1), hidden: el.classList.contains('pd-hidden-object') }; if (el.dataset.pdType === 'image') { b.fit = el.dataset.imgFit || 'cover'; b.posX = Number(el.dataset.imgX || 50); b.posY = Number(el.dataset.imgY || 50); } return b; }
  function setBox(el, b) { const snap = activeProfile().snap ? 2 : 0; const s = v => snap ? Math.round(v / snap) * snap : v; el.style.left = s(b.x) + 'mm'; el.style.top = s(b.y) + 'mm'; el.style.width = clamp(s(b.w), 8, 260) + 'mm'; el.style.height = clamp(s(b.h), 8, 260) + 'mm'; el.style.transform = `rotate(${Math.round(b.r || 0)}deg)`; el.style.zIndex = b.z || 1; }
  function down(e) { const el = e.currentTarget; select(el); const b = box(el); const r = el.getBoundingClientRect(); state.action = e.target.dataset.h ? 'resize-' + e.target.dataset.h : (e.target.dataset.rotate ? 'rotate' : 'move'); state.start = { x: e.clientX, y: e.clientY, b, rect: r }; e.preventDefault(); }
  function onMove(e) { if (!state.action || !state.selectedId) return; const el = selected(); if (!el) return; const dx = (e.clientX - state.start.x) / MM, dy = (e.clientY - state.start.y) / MM; const b = { ...state.start.b };
    if (state.action === 'move') { b.x += dx; b.y += dy; }
    else if (state.action === 'rotate') { const cx = state.start.rect.left + state.start.rect.width / 2, cy = state.start.rect.top + state.start.rect.height / 2; b.r = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90; }
    else { if (state.action.includes('e')) b.w += dx; if (state.action.includes('s')) b.h += dy; if (state.action.includes('w')) { b.x += dx; b.w -= dx; } if (state.action.includes('n')) { b.y += dy; b.h -= dy; } }
    setBox(el, b); syncPanel(); }
  function onUp() { if (!state.action) return; saveSelected(); state.action = null; state.start = null; }
  function saveSelected() { const el = selected(); if (!el || !state.activeProfile) return; state.activeProfile.transforms[el.dataset.pdId] = box(el); saveProfiles(); }
  function syncPanel() { const el = selected(); ['x','y','w','h','r','z'].forEach(k => { const i = document.getElementById('pd-' + k); if (i) i.value = el ? Math.round(box(el)[k]) : ''; }); const imgPanel = document.getElementById('pd-image-panel'); const isImage = !!(el && el.dataset.pdType === 'image'); if (imgPanel) imgPanel.classList.toggle('pd-disabled', !isImage); if (isImage) { const fit = document.getElementById('pd-img-fit'), ix = document.getElementById('pd-img-x'), iy = document.getElementById('pd-img-y'); if (fit) fit.value = el.dataset.imgFit || 'cover'; if (ix) ix.value = el.dataset.imgX || 50; if (iy) iy.value = el.dataset.imgY || 50; const xl = document.getElementById('pd-img-x-label'), yl = document.getElementById('pd-img-y-label'); if (xl) xl.textContent = (el.dataset.imgX || 50) + '%'; if (yl) yl.textContent = (el.dataset.imgY || 50) + '%'; } }

  function setImageFit(el, fit, posX, posY) {
    if (!el || el.dataset.pdType !== 'image') return;
    el.dataset.imgFit = fit || el.dataset.imgFit || 'cover';
    el.dataset.imgX = clamp(Number(posX == null ? el.dataset.imgX || 50 : posX), 0, 100);
    el.dataset.imgY = clamp(Number(posY == null ? el.dataset.imgY || 50 : posY), 0, 100);
    el.style.setProperty('--pd-img-fit', el.dataset.imgFit);
    el.style.setProperty('--pd-img-pos-x', el.dataset.imgX + '%');
    el.style.setProperty('--pd-img-pos-y', el.dataset.imgY + '%');
    syncPanel();
    saveSelected();
  }
  function updateImageFitFromPanel() { const el = selected(); if (!el || el.dataset.pdType !== 'image') return; setImageFit(el, document.getElementById('pd-img-fit').value, document.getElementById('pd-img-x').value, document.getElementById('pd-img-y').value); }

  function updateSelectedFromPanel() { const el = selected(); if (!el) return; setBox(el, { x:+document.getElementById('pd-x').value||0, y:+document.getElementById('pd-y').value||0, w:+document.getElementById('pd-w').value||20, h:+document.getElementById('pd-h').value||10, r:+document.getElementById('pd-r').value||0, z:+document.getElementById('pd-z').value||1 }); saveSelected(); }

  function ensureTextVisibleForPrint(root) {
    const page = root || document.getElementById('pd-page');
    if (!page) return;
    Array.from(page.querySelectorAll('.pd-object[data-pd-type="text"], .pd-section-heading')).forEach(el => {
      if (el.classList.contains('pd-hidden-object')) return;
      const content = el.querySelector('.pd-object-content');
      if (!content) return;
      // If old saved Studio transforms made a text box too short, expand it instead of clipping real content.
      const neededMm = Math.ceil((content.scrollHeight + 8) / MM);
      const currentMm = num(el.style.height);
      if (neededMm > currentMm) el.style.height = neededMm + 'mm';
    });

    // When a project text card grows, keep its own image grid below the card.
    Array.from(page.querySelectorAll('.pd-project[data-pd-id^="project-"]')).forEach(project => {
      const match = (project.dataset.pdId || '').match(/^project-(\d+)$/);
      if (!match) return;
      const prefix = `project-${match[1]}-image-`;
      const projectBox = box(project);
      const images = Array.from(page.querySelectorAll(`.pd-image[data-pd-id^="${prefix}"]`));
      if (!images.length) return;
      const minImageTop = Math.min(...images.map(img => box(img).y));
      const requiredTop = projectBox.y + projectBox.h + 5;
      if (Number.isFinite(minImageTop) && minImageTop < requiredTop) {
        const delta = requiredTop - minImageTop;
        images.forEach(img => {
          const b = box(img);
          b.y += delta;
          setBox(img, b);
        });
      }
    });

    const maxY = Array.from(page.querySelectorAll('.pd-object')).reduce((max, el) => {
      if (el.classList.contains('pd-hidden-object')) return max;
      const b = box(el);
      return Math.max(max, b.y + b.h + 12);
    }, activeProfile().orientation === 'landscape' ? 210 : 297);
    page.style.minHeight = Math.ceil(maxY) + 'mm';
  }

  function prepareImagesForPrint(root) {
    const imgs = Array.from((root || document).querySelectorAll('img'));
    imgs.forEach(img => {
      img.loading = 'eager';
      img.decoding = 'sync';
      const src = imageSrc(img);
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    return Promise.all(imgs.map(img => {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      if (img.decode) return img.decode().catch(() => {});
      return new Promise(resolve => { img.onload = img.onerror = resolve; setTimeout(resolve, 1200); });
    }));
  }

  async function printPdf() {
    saveSelected();
    const p = activeProfile();
    let st = document.getElementById('pd-print-size');
    if (st) st.remove();
    st = document.createElement('style');
    st.id = 'pd-print-size';
    st.textContent = `@media print{@page{size:A4 ${p.orientation === 'landscape' ? 'landscape' : 'portrait'};margin:0}}`;
    document.head.appendChild(st);
    ensureTextVisibleForPrint(document.getElementById('pd-page'));
    await prepareImagesForPrint(document.getElementById('pd-page'));
    document.body.classList.add('print-designer-printing');
    window.print();
    setTimeout(() => document.body.classList.remove('print-designer-printing'), 600);
  }
  function open(mode) { shell(); state.data = resolvePrintData(); state.profiles = loadProfiles(); state.mode = mode === 'resume' || mode === 'portfolio' ? mode : (state.data.layout || 'portfolio'); activeProfile(); document.getElementById('print-designer-root').classList.remove('hidden'); document.body.classList.add('print-designer-open'); render(); }
  function close() { saveSelected(); const root = document.getElementById('print-designer-root'); if (root) root.classList.add('hidden'); document.body.classList.remove('print-designer-open'); }

  function installExportButton() {
    const docx = document.getElementById('btn-export-docx'); if (docx) { docx.classList.add('hidden'); docx.disabled = true; docx.setAttribute('aria-hidden', 'true'); docx.tabIndex = -1; }
    const land = document.getElementById('btn-export-pdf-landscape'); if (land) { land.classList.add('hidden'); land.disabled = true; land.setAttribute('aria-hidden', 'true'); land.tabIndex = -1; }
    const panel = document.getElementById('public-export-branch');
    if (panel && !document.getElementById('btn-print-designer-studio')) { const b = document.createElement('button'); b.id = 'btn-print-designer-studio'; b.type = 'button'; b.title = 'PDF Layout Studio'; b.innerHTML = '<i data-lucide="layout-template" class="w-4 h-4"></i><span>Studio</span>'; b.onclick = () => open(); panel.appendChild(b); }
    const exportPanel = document.getElementById('export-panel');
    if (exportPanel && !document.getElementById('btn-print-designer-panel')) { const b = document.createElement('button'); b.id = 'btn-print-designer-panel'; b.type = 'button'; b.className = 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all'; b.innerHTML = '<i data-lucide="layout-template" class="w-5 h-5"></i> PDF Layout Studio'; b.onclick = () => open(); exportPanel.appendChild(b); }
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  window.PrintDesigner = { open, close, loadProfiles };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installExportButton); else installExportButton();
  setTimeout(installExportButton, 1000);
})();
