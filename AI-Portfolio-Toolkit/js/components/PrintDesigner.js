// js/components/PrintDesigner.js
// V33 Interactive Print Designer
// Print-only composition layer: drag / resize / rotate layout objects without mutating portfolio data.
(function () {
  'use strict';

  const PROFILE_KEY = 'ai-portfolio-print-designer-v33';
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
    if (document.getElementById('pd-v33-style')) return;
    const style = document.createElement('style');
    style.id = 'pd-v33-style';
    style.textContent = `
      .print-designer-root.hidden{display:none!important}.print-designer-root{position:fixed;inset:0;z-index:300;color:#e5e7eb}.pd-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.92);backdrop-filter:blur(10px)}.pd-shell{position:relative;height:100%;display:flex;flex-direction:column}.pd-topbar{height:76px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px;border-bottom:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.9)}.pd-topbar h2{margin:0;color:#fff;font-size:22px;font-weight:900}.pd-kicker{color:#67e8f9;font-size:11px;text-transform:uppercase;letter-spacing:.18em;font-weight:800}.pd-top-actions{display:flex;gap:8px;flex-wrap:wrap}.pd-top-actions button,.pd-sidebar button{border:1px solid rgba(255,255,255,.14);background:rgba(59,130,246,.18);color:#fff;border-radius:12px;padding:9px 12px;font-weight:800;font-size:12px}.pd-top-actions button:hover,.pd-sidebar button:hover{background:rgba(59,130,246,.34)}.pd-top-actions .pd-danger{background:rgba(244,63,94,.2)}.pd-body{min-height:0;flex:1;display:grid;grid-template-columns:300px 1fr}.pd-sidebar{overflow:auto;padding:16px;border-right:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.95)}.pd-sidebar label{display:block;font-size:12px;color:#cbd5e1;font-weight:800;margin-bottom:14px}.pd-sidebar select,.pd-sidebar input[type=number]{width:100%;margin-top:6px;background:#020617;color:#e5e7eb;border:1px solid rgba(148,163,184,.35);border-radius:10px;padding:8px;outline:none}.pd-sidebar input[type=range]{width:100%;margin-top:8px;accent-color:#22d3ee}.pd-toggle-row{display:flex;gap:12px;margin-bottom:12px}.pd-toggle-row label{display:flex;align-items:center;gap:6px;margin:0}.pd-panel{border:1px solid rgba(148,163,184,.18);background:rgba(30,41,59,.45);border-radius:18px;padding:14px;margin:14px 0}.pd-panel h3{color:#fff;font-size:14px;font-weight:900;margin:0 0 8px}.pd-panel p{color:#cbd5e1;font-size:12px;line-height:1.55;margin:8px 0 0}.pd-control-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.pd-small-actions{display:grid;gap:8px;margin-top:12px}.pd-workspace{overflow:auto;background:radial-gradient(circle at 10% 20%,rgba(59,130,246,.14),transparent 30%),#0f172a;padding:36px}.pd-stage{width:max-content;min-width:100%;min-height:100%;display:flex;align-items:flex-start;justify-content:center;padding:24px}.pd-page{position:relative;background:#fff;color:#0f172a;box-shadow:0 30px 90px rgba(0,0,0,.4);transform-origin:top center;overflow:hidden}.pd-page.pd-portrait{width:210mm;min-height:297mm}.pd-page.pd-landscape{width:297mm;min-height:210mm}.pd-page.pd-grid-on{background-image:linear-gradient(rgba(15,23,42,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.06) 1px,transparent 1px);background-size:10mm 10mm}.pd-object{position:absolute;border:1px dashed transparent;user-select:none;touch-action:none;transform-origin:center center}.pd-object:hover{border-color:rgba(14,165,233,.45)}.pd-object.pd-selected{border:2px solid #06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.18)}.pd-object-content{width:100%;height:100%;overflow:hidden;background:rgba(255,255,255,.9);border-radius:6px;padding:10px}.pd-image .pd-object-content{padding:0;background:#f8fafc;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center}.pd-object img{width:100%;height:100%;object-fit:contain;display:block}.pd-object h1{font-size:30px;line-height:1.05;font-weight:900;margin:0 0 6px;color:#0f172a}.pd-object h2{font-size:18px;line-height:1.15;font-weight:900;margin:0 0 6px;color:#0f766e}.pd-object h3{font-size:13px;line-height:1.2;font-weight:800;margin:0 0 6px;color:#334155}.pd-object p{font-size:12px;line-height:1.45;color:#334155;margin:0}.pd-resume-avatar{float:left;width:54px!important;height:54px!important;object-fit:cover!important;border-radius:14px;margin:0 10px 6px 0}.pd-object-toolbar{position:absolute;left:0;top:-27px;height:24px;display:none;align-items:center;gap:8px;background:rgba(15,23,42,.92);color:#fff;border-radius:999px;padding:2px 4px 2px 10px;font-size:11px;font-weight:800;white-space:nowrap;z-index:20}.pd-selected .pd-object-toolbar{display:flex}.pd-object-toolbar button{border:0;background:rgba(244,63,94,.8);color:#fff;border-radius:999px;padding:3px 7px;font-size:10px}.pd-handle,.pd-rotate{display:none;position:absolute;width:12px;height:12px;background:#06b6d4;border:2px solid #fff;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.35);z-index:30}.pd-selected .pd-handle,.pd-selected .pd-rotate{display:block}.pd-handle-nw{left:-7px;top:-7px;cursor:nwse-resize}.pd-handle-ne{right:-7px;top:-7px;cursor:nesw-resize}.pd-handle-sw{left:-7px;bottom:-7px;cursor:nesw-resize}.pd-handle-se{right:-7px;bottom:-7px;cursor:nwse-resize}.pd-rotate{left:50%;top:-42px;transform:translateX(-50%);background:#f59e0b;cursor:grab}.pd-rotate:after{content:"";position:absolute;left:50%;top:11px;width:1px;height:28px;background:#f59e0b}.pd-hidden-object{opacity:.18!important;outline:2px dashed #ef4444}#pd-toast{position:fixed;z-index:400;right:24px;bottom:24px;background:rgba(15,23,42,.95);color:#fff;border:1px solid rgba(34,211,238,.5);border-radius:16px;padding:12px 16px;font-weight:800;box-shadow:0 20px 50px rgba(0,0,0,.35)}@media(max-width:900px){.pd-body{grid-template-columns:1fr}.pd-sidebar{max-height:38vh;border-right:0;border-bottom:1px solid rgba(148,163,184,.25)}.pd-workspace{padding:16px}}@media print{body.print-designer-printing>*:not(#print-designer-root){display:none!important}body.print-designer-printing #print-designer-root,body.print-designer-printing .pd-shell,body.print-designer-printing .pd-body,body.print-designer-printing .pd-workspace,body.print-designer-printing .pd-stage{display:block!important;position:static!important;inset:auto!important;width:auto!important;height:auto!important;overflow:visible!important;padding:0!important;margin:0!important;background:#fff!important}body.print-designer-printing .pd-backdrop,body.print-designer-printing .pd-topbar,body.print-designer-printing .pd-sidebar,body.print-designer-printing .no-print,body.print-designer-printing .pd-handle,body.print-designer-printing .pd-rotate,body.print-designer-printing .pd-object-toolbar{display:none!important}body.print-designer-printing .pd-page{transform:none!important;box-shadow:none!important;margin:0!important;overflow:visible!important;page-break-after:auto}body.print-designer-printing .pd-object{border:none!important;box-shadow:none!important}body.print-designer-printing .pd-object-content{border-color:transparent!important}body.print-designer-printing .pd-hidden-object{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function loadProfiles() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || defaultProfiles(); } catch { return defaultProfiles(); } }
  function saveProfiles() { localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profiles)); toast('Print profile saved'); }
  function modeStore() { const d = defaultProfiles(); state.profiles[state.mode] ||= d[state.mode]; return state.profiles[state.mode]; }
  function activeProfile() { const store = modeStore(); let p = store.profiles.find(x => x.id === store.activeProfileId) || store.profiles[0]; store.activeProfileId = p.id; p.transforms ||= {}; state.activeProfile = p; return p; }
  function getTextData() { const d = state.data || {}; const th = d.lang === 'th'; return { name: th ? d.name_th : d.name_en, role: th ? d.role_th : d.role_en, bio: th ? d.bio_th : d.bio_en, skills: th ? d.skills_th : d.skills_en }; }
  function toast(msg) { const old = document.getElementById('pd-toast'); if (old) old.remove(); const t = document.createElement('div'); t.id = 'pd-toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }

  function shell() {
    injectCss();
    if (document.getElementById('print-designer-root')) return;
    const root = document.createElement('div'); root.id = 'print-designer-root'; root.className = 'print-designer-root hidden';
    root.innerHTML = `<div class="pd-backdrop"></div><div class="pd-shell" role="dialog" aria-modal="true" aria-label="PDF Layout Studio"><div class="pd-topbar no-print"><div><div class="pd-kicker">V33 Print-only Composition</div><h2>PDF Layout Studio</h2></div><div class="pd-top-actions"><button id="pd-dup" type="button">Duplicate Profile</button><button id="pd-save" type="button">Save Print Profile</button><button id="pd-print" type="button">Print PDF</button><button id="pd-reset" class="pd-danger" type="button">Reset Layout</button><button id="pd-close" type="button">Exit</button></div></div><div class="pd-body"><aside class="pd-sidebar no-print"><div class="pd-panel"><h3>Mode</h3><div class="pd-toggle-row"><label><input type="radio" name="pd-mode" value="portfolio"> Portfolio</label><label><input type="radio" name="pd-mode" value="resume"> Resume</label></div><label>Profile<select id="pd-profile"></select></label><label>Orientation<select id="pd-orientation"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label>Page Scale <span id="pd-scale-label"></span><input id="pd-scale" type="range" min="70" max="130" step="5"></label><div class="pd-toggle-row"><label><input id="pd-snap" type="checkbox"> Snap</label><label><input id="pd-grid" type="checkbox"> Grid</label></div><p>Designer นี้แก้เฉพาะตำแหน่ง/ขนาด/หมุน/ซ่อน ใน print profile เท่านั้น ไม่แก้ข้อมูล Portfolio/Resume หลัก</p></div><div class="pd-panel"><h3>Selected Object</h3><div class="pd-control-grid"><label>X<input id="pd-x" type="number"></label><label>Y<input id="pd-y" type="number"></label><label>W<input id="pd-w" type="number"></label><label>H<input id="pd-h" type="number"></label><label>Rotate<input id="pd-r" type="number"></label><label>Layer<input id="pd-z" type="number"></label></div><div class="pd-small-actions"><button id="pd-hide" type="button">Hide / Show</button><button id="pd-front" type="button">Bring Forward</button><button id="pd-back" type="button">Send Backward</button></div></div></aside><main class="pd-workspace"><div class="pd-stage"><div id="pd-page" class="pd-page"></div></div></main></div></div>`;
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
    document.getElementById('pd-hide').onclick = () => { const el = selected(); if (!el) return; el.classList.toggle('pd-hidden-object'); saveSelected(); };
    document.getElementById('pd-front').onclick = () => { const el = selected(); if (!el) return; el.style.zIndex = Number(el.style.zIndex || 1) + 1; saveSelected(); syncPanel(); };
    document.getElementById('pd-back').onclick = () => { const el = selected(); if (!el) return; el.style.zIndex = Math.max(1, Number(el.style.zIndex || 1) - 1); saveSelected(); syncPanel(); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  function duplicateProfile() { const old = activeProfile(); const copy = JSON.parse(JSON.stringify(old)); copy.id = uid(); copy.name = prompt('Profile name', old.name + ' Copy') || (old.name + ' Copy'); modeStore().profiles.push(copy); modeStore().activeProfileId = copy.id; render(); toast('Profile duplicated'); }
  function applyPage() { const p = activeProfile(); const page = document.getElementById('pd-page'); page.className = `pd-page pd-${p.orientation} ${p.grid ? 'pd-grid-on' : ''}`; page.style.transform = `scale(${(p.pageScale || 100) / 100})`; document.getElementById('pd-scale-label').textContent = (p.pageScale || 100) + '%'; }

  function baseBoxes() {
    const d = state.data || {}, t = getTextData(), exp = Array.isArray(d.exp) ? d.exp : [], out = [];
    out.push({ id: 'header', type: 'text', x: 14, y: 14, w: state.mode === 'resume' ? 72 : 125, h: 34, z: 1, html: `<h1>${esc(t.name || 'Your Name')}</h1><h3>${esc(t.role || '')}</h3>` });
    if (d.avatar) out.push({ id: 'avatar', type: 'image', x: state.mode === 'resume' ? 14 : 155, y: 14, w: 32, h: 32, z: 2, src: d.avatar });
    out.push({ id: 'bio', type: 'text', x: state.mode === 'resume' ? 14 : 14, y: state.mode === 'resume' ? 54 : 54, w: state.mode === 'resume' ? 74 : 180, h: 32, z: 1, html: `<h2>Summary</h2><p>${esc(t.bio || '')}</p>` });
    if (t.skills) out.push({ id: 'skills', type: 'text', x: state.mode === 'resume' ? 14 : 14, y: state.mode === 'resume' ? 91 : 91, w: state.mode === 'resume' ? 74 : 180, h: 22, z: 1, html: `<h2>Skills</h2><p>${esc(t.skills)}</p>` });
    let y = state.mode === 'resume' ? 122 : 122;
    exp.slice(0, state.mode === 'resume' ? 6 : 4).forEach((e, i) => {
      const th = d.lang === 'th'; const title = th ? e.title_th : e.title_en; const company = th ? e.company_th : e.company_en; const desc = th ? e.desc_th : e.desc_en;
      out.push({ id: `exp-${i}`, type: 'text', x: state.mode === 'resume' ? 92 : 14, y, w: state.mode === 'resume' ? 104 : 180, h: 32, z: 1, html: `<h2>${esc(title || 'Project')}</h2><h3>${esc(company || '')}</h3><p>${esc(desc || '')}</p>` });
      if (state.mode === 'portfolio' && Array.isArray(e.images)) e.images.slice(0, 4).forEach((src, j) => out.push({ id: `exp-${i}-img-${j}`, type: 'image', x: 14 + (j % 2) * 92, y: y + 38 + Math.floor(j / 2) * 50, w: 86, h: 44, z: 2, src }));
      y += state.mode === 'resume' ? 38 : 140;
    });
    return out;
  }

  function render() {
    const p = activeProfile(), store = modeStore();
    document.querySelectorAll('input[name="pd-mode"]').forEach(i => { i.checked = i.value === state.mode; });
    const sel = document.getElementById('pd-profile'); sel.innerHTML = store.profiles.map(pr => `<option value="${esc(pr.id)}">${esc(pr.name)}</option>`).join(''); sel.value = store.activeProfileId;
    document.getElementById('pd-orientation').value = p.orientation; document.getElementById('pd-scale').value = p.pageScale || 100; document.getElementById('pd-snap').checked = !!p.snap; document.getElementById('pd-grid').checked = !!p.grid;
    const page = document.getElementById('pd-page'); applyPage(); page.innerHTML = '';
    baseBoxes().forEach(b => page.appendChild(makeObject({ ...b, ...(p.transforms[b.id] || {}) })));
    state.selectedId = null; syncPanel();
  }

  function makeObject(b) {
    const el = document.createElement('div'); el.className = `pd-object pd-${b.type}${b.hidden ? ' pd-hidden-object' : ''}`; el.dataset.pdId = b.id; el.dataset.pdType = b.type;
    el.style.left = (b.x || 0) + 'mm'; el.style.top = (b.y || 0) + 'mm'; el.style.width = (b.w || 40) + 'mm'; el.style.height = (b.h || 20) + 'mm'; el.style.zIndex = b.z || 1; el.style.transform = `rotate(${b.r || 0}deg)`;
    el.innerHTML = `<div class="pd-object-toolbar"><span>${esc(b.id)}</span><button type="button">hide</button></div><div class="pd-object-content">${b.type === 'image' ? `<img src="${b.src}" alt="">` : (b.html || '')}</div><span class="pd-handle pd-handle-nw" data-h="nw"></span><span class="pd-handle pd-handle-ne" data-h="ne"></span><span class="pd-handle pd-handle-sw" data-h="sw"></span><span class="pd-handle pd-handle-se" data-h="se"></span><span class="pd-rotate" data-rotate="1"></span>`;
    el.addEventListener('pointerdown', down); el.querySelector('.pd-object-toolbar button').onclick = ev => { ev.stopPropagation(); el.classList.toggle('pd-hidden-object'); saveSelected(); };
    return el;
  }

  function selected() { return state.selectedId ? document.querySelector(`[data-pd-id="${CSS.escape(state.selectedId)}"]`) : null; }
  function select(el) { document.querySelectorAll('.pd-object').forEach(o => o.classList.remove('pd-selected')); state.selectedId = el ? el.dataset.pdId : null; if (el) el.classList.add('pd-selected'); syncPanel(); }
  function num(v) { return Number(String(v || '').replace('mm', '').replace('px', '')) || 0; }
  function box(el) { return { x: num(el.style.left), y: num(el.style.top), w: num(el.style.width), h: num(el.style.height), r: Number((el.style.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/) || [0, 0])[1]), z: Number(el.style.zIndex || 1), hidden: el.classList.contains('pd-hidden-object') }; }
  function setBox(el, b) { const snap = activeProfile().snap ? 2 : 0; const s = v => snap ? Math.round(v / snap) * snap : v; el.style.left = s(b.x) + 'mm'; el.style.top = s(b.y) + 'mm'; el.style.width = clamp(s(b.w), 8, 260) + 'mm'; el.style.height = clamp(s(b.h), 8, 260) + 'mm'; el.style.transform = `rotate(${Math.round(b.r || 0)}deg)`; el.style.zIndex = b.z || 1; }
  function down(e) { const el = e.currentTarget; select(el); const b = box(el); const r = el.getBoundingClientRect(); state.action = e.target.dataset.h ? 'resize-' + e.target.dataset.h : (e.target.dataset.rotate ? 'rotate' : 'move'); state.start = { x: e.clientX, y: e.clientY, b, rect: r }; e.preventDefault(); }
  function onMove(e) { if (!state.action || !state.selectedId) return; const el = selected(); if (!el) return; const dx = (e.clientX - state.start.x) / MM, dy = (e.clientY - state.start.y) / MM; const b = { ...state.start.b };
    if (state.action === 'move') { b.x += dx; b.y += dy; }
    else if (state.action === 'rotate') { const cx = state.start.rect.left + state.start.rect.width / 2, cy = state.start.rect.top + state.start.rect.height / 2; b.r = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90; }
    else { if (state.action.includes('e')) b.w += dx; if (state.action.includes('s')) b.h += dy; if (state.action.includes('w')) { b.x += dx; b.w -= dx; } if (state.action.includes('n')) { b.y += dy; b.h -= dy; } }
    setBox(el, b); syncPanel(); }
  function onUp() { if (!state.action) return; saveSelected(); state.action = null; state.start = null; }
  function saveSelected() { const el = selected(); if (!el || !state.activeProfile) return; state.activeProfile.transforms[el.dataset.pdId] = box(el); saveProfiles(); }
  function syncPanel() { const el = selected(); ['x','y','w','h','r','z'].forEach(k => { const i = document.getElementById('pd-' + k); if (i) i.value = el ? Math.round(box(el)[k]) : ''; }); }
  function updateSelectedFromPanel() { const el = selected(); if (!el) return; setBox(el, { x:+document.getElementById('pd-x').value||0, y:+document.getElementById('pd-y').value||0, w:+document.getElementById('pd-w').value||20, h:+document.getElementById('pd-h').value||10, r:+document.getElementById('pd-r').value||0, z:+document.getElementById('pd-z').value||1 }); saveSelected(); }

  function printPdf() { saveSelected(); const p = activeProfile(); let st = document.getElementById('pd-print-size'); if (st) st.remove(); st = document.createElement('style'); st.id = 'pd-print-size'; st.textContent = `@media print{@page{size:A4 ${p.orientation === 'landscape' ? 'landscape' : 'portrait'};margin:0}}`; document.head.appendChild(st); document.body.classList.add('print-designer-printing'); window.print(); setTimeout(() => document.body.classList.remove('print-designer-printing'), 600); }
  function open(mode) { shell(); state.data = window.StorageHandler && StorageHandler.load ? StorageHandler.load() : {}; state.profiles = loadProfiles(); state.mode = mode === 'resume' || mode === 'portfolio' ? mode : (state.data.layout || 'portfolio'); activeProfile(); document.getElementById('print-designer-root').classList.remove('hidden'); document.body.classList.add('print-designer-open'); render(); }
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
