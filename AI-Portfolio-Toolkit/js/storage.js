// js/storage.js
const StorageHandler = {
    save: (data) => {
        try {
            // 🌟 1. Auto-Sort Algorithm: เรียงลำดับประสบการณ์ (ใหม่ -> เก่า) อัตโนมัติก่อนเซฟ
            if (data.exp && Array.isArray(data.exp)) {
                const monthMap = {
                    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12, '': 0
                };

                data.exp.sort((a, b) => {
                    // ให้ความสำคัญกับปี/เดือนที่จบงาน (ถ้าเป็น ปัจจุบัน ให้ค่าเป็น 9999 สูงสุด)
                    let aEndYear = a.isCurrent ? 9999 : (parseInt(a.endYear) || parseInt(a.startYear) || 0);
                    let bEndYear = b.isCurrent ? 9999 : (parseInt(b.endYear) || parseInt(b.startYear) || 0);

                    let aEndMonth = a.isCurrent ? 12 : monthMap[a.endMonth || ''];
                    let bEndMonth = b.isCurrent ? 12 : monthMap[b.endMonth || ''];

                    if (aEndYear !== bEndYear) return bEndYear - aEndYear; // ปีล่าสุดขึ้นก่อน
                    if (aEndMonth !== bEndMonth) return bEndMonth - aEndMonth; // เดือนล่าสุดขึ้นก่อน

                    // ถ้าจบพร้อมกัน ให้ดูปี/เดือนที่เริ่มงาน
                    let aStartYear = parseInt(a.startYear) || 0;
                    let bStartYear = parseInt(b.startYear) || 0;
                    if (aStartYear !== bStartYear) return bStartYear - aStartYear;

                    let aStartMonth = monthMap[a.startMonth || ''];
                    let bStartMonth = monthMap[b.startMonth || ''];
                    return bStartMonth - aStartMonth;
                });
            }

            // 🌟 2. สำหรับไฟล์ดาวน์โหลด: ให้อัปเดตสถานะกลับเข้าไปใน Data ที่ฝังอยู่ (ทำให้สลับ Layout/Theme ไปมาได้เรื่อยๆ)
            const dataToStore = { ...data };
            delete dataToStore._isFirstRunDemo;
            delete dataToStore._hasStoredCache;

            if (typeof window !== 'undefined' && window.INJECTED_PORTFOLIO_DATA) {
                window.INJECTED_PORTFOLIO_DATA = dataToStore;
            }

            localStorage.setItem('ai-portfolio-pro-cache', JSON.stringify(dataToStore));
            console.log("Data saved & sorted successfully!");

        } catch (e) {
            console.error("Storage Error:", e);
            alert("บันทึกข้อมูลไม่สำเร็จ: พื้นที่จัดเก็บข้อมูลเต็ม (ไฟล์รูปภาพอาจจะใหญ่หรือเยอะเกินไป กรุณาลบรูปที่ไม่ใช้ออก)");
        }
    },

    load: () => {
        let data = null;
        let hasStoredCache = false;

        // 🌟 เช็คว่าเป็นการเปิดจากไฟล์ที่ดาวน์โหลดไปหรือไม่
        if (typeof window !== 'undefined' && window.INJECTED_PORTFOLIO_DATA) {
            data = window.INJECTED_PORTFOLIO_DATA;
        } else {
            const d = localStorage.getItem('ai-portfolio-pro-cache');
            hasStoredCache = d !== null;
            try {
                data = d ? JSON.parse(d) : null;
            } catch (e) {
                console.warn('Invalid portfolio cache ignored:', e);
                data = null;
                hasStoredCache = false;
            }
        }

        // 🌟 3. Migration: แปลงข้อมูลระบบเก่า ให้รองรับ 2 ภาษาอัตโนมัติ
        if (data) {
            if (data.theme) {
                data.layout = data.theme;
                delete data.theme;
            }

            if (data.name && !data.name_th) {
                data.name_th = data.name;
                data.name_en = data.name;
                data.role_th = data.role;
                data.role_en = data.role;
                data.bio_th = data.bio;
                data.bio_en = data.bio;
                data.skills_th = data.skills;
                data.skills_en = data.skills;

                if (data.exp) {
                    data.exp = data.exp.map(e => ({
                        ...e,
                        company_th: e.company || '',
                        company_en: e.company || '',
                        title_th: e.title || '',
                        title_en: e.title || '',
                        desc_th: e.desc || '',
                        desc_en: e.desc || '',
                        highlights_th: e.highlights || [],
                        highlights_en: e.highlights || []
                    }));
                }
            }
        }

        const defaultData = {
            name_th: '', name_en: '',
            role_th: '', role_en: '',
            bio_th: '', bio_en: '',
            layout: 'portfolio',
            colorMode: 'dark',
            portfolioStyle: 'tech',
            lang: 'th',
            skills_th: '',
            skills_en: '',
            
            education_th: '', education_en: '',
            certifications_th: '', certifications_en: '',
            awards_th: '', awards_en: '',
            caseStudies_th: '', caseStudies_en: '',
            services_th: '', services_en: '',
            testimonials_th: '', testimonials_en: '',
            clients_th: '', clients_en: '',
            cta_th: '', cta_en: '',
            articles_th: '', articles_en: '',
            email: '', phone: '', linkedin: '', avatar: '',
            exp: []
        };

        const firstRunDemoData = {
            _isFirstRunDemo: true,
            name_th: 'Your Portfolio',
            name_en: 'Your Portfolio',
            role_th: 'Portfolio Template',
            role_en: 'Portfolio Template',
            bio_th: 'Add your name, role, summary, skills, and project work to turn this template into a finished portfolio.',
            bio_en: 'Add your name, role, summary, skills, and project work to turn this template into a finished portfolio.',
            skills_th: 'Portfolio, Resume, Projects, Skills, Contact',
            skills_en: 'Portfolio, Resume, Projects, Skills, Contact',
            email: 'hello@example.com',
            phone: '+66 00 000 0000',
            linkedin: 'linkedin.com/in/your-profile',
            exp: [{
                startYear: new Date().getFullYear().toString(),
                company_th: 'Your work or organization',
                company_en: 'Your work or organization',
                title_th: 'Featured project placeholder',
                title_en: 'Featured project placeholder',
                desc_th: 'Replace this block with your first project, responsibility, result, or achievement.',
                desc_en: 'Replace this block with your first project, responsibility, result, or achievement.',
                highlights_th: [
                    'Add project screenshots from Edit',
                    'Describe measurable results',
                    'Export as portfolio, resume, PDF, DOCX, or PPTX'
                ],
                highlights_en: [
                    'Add project screenshots from Edit',
                    'Describe measurable results',
                    'Export as portfolio, resume, PDF, DOCX, or PPTX'
                ],
                images: []
            }]
        };

        if (data) return { ...defaultData, ...data, _hasStoredCache: hasStoredCache };
        return hasStoredCache ? { ...defaultData, _hasStoredCache: true } : { ...defaultData, ...firstRunDemoData, _hasStoredCache: false };
    }
};



// V43 guard: when a downloaded/template file has injected placeholder data, prefer the user's real local cache.
// This prevents PDF Layout Studio from falling back to "Your Name" / demo data while project images or real fields already exist.
(function () {
    'use strict';
    if (!window.StorageHandler || StorageHandler.__v43RealDataGuard) return;

    const originalLoad = StorageHandler.load.bind(StorageHandler);
    const originalSave = StorageHandler.save.bind(StorageHandler);
    const placeholderRx = /^(Your Portfolio|Portfolio Template|Your Name|hello@example\.com|\+66 00 000 0000|linkedin\.com\/in\/your-profile|Portfolio, Resume, Projects, Skills, Contact|Add your name, role, summary, skills, and project work to turn this template into a finished portfolio\.|Featured project placeholder|Your work or organization|Replace this block with your first project, responsibility, result, or achievement\.)$/i;
    const text = value => String(value || '').replace(/\s+/g, ' ').trim();
    const meaningful = value => {
        const t = text(value);
        return t && !placeholderRx.test(t) ? t : '';
    };
    const clone = value => {
        try { return JSON.parse(JSON.stringify(value || {})); } catch (_) { return value || {}; }
    };
    const parseCache = () => {
        try {
            const raw = localStorage.getItem('ai-portfolio-pro-cache');
            return raw ? JSON.parse(raw) : null;
        } catch (_) { return null; }
    };
    const hasUsefulProject = item => {
        if (!item) return false;
        const fields = ['title_th','title_en','company_th','company_en','desc_th','desc_en','title','company','desc'];
        return fields.some(key => meaningful(item[key])) || (Array.isArray(item.images) && item.images.some(Boolean));
    };
    const hasUsefulData = data => {
        if (!data || typeof data !== 'object') return false;
        const fields = ['name_th','name_en','role_th','role_en','bio_th','bio_en','skills_th','skills_en','education_th','education_en','email','phone','linkedin','avatar'];
        return fields.some(key => meaningful(data[key])) || (Array.isArray(data.exp) && data.exp.some(hasUsefulProject));
    };
    const mergeUseful = (primary, fallback) => {
        const base = clone(fallback || {});
        const next = clone(primary || {});
        Object.keys(next).forEach(key => {
            const value = next[key];
            if (Array.isArray(value)) {
                if (value.length) base[key] = value;
            } else if (value && typeof value === 'object') {
                base[key] = { ...(base[key] || {}), ...value };
            } else if (value !== undefined && value !== null && String(value).length) {
                base[key] = value;
            }
        });
        return base;
    };

    StorageHandler.load = function loadWithRealCachePreference() {
        const loaded = originalLoad();
        const cache = parseCache();
        const result = hasUsefulData(cache) ? mergeUseful(cache, loaded) : loaded;
        try { window.__AI_PORTFOLIO_ACTIVE_DATA = clone(result); } catch (_) {}
        return result;
    };

    StorageHandler.save = function saveAndExposeActiveData(data) {
        const next = { ...(data || {}), _updatedAt: new Date().toISOString() };
        try { window.__AI_PORTFOLIO_ACTIVE_DATA = clone(next); } catch (_) {}
        return originalSave(next);
    };

    StorageHandler.__v43RealDataGuard = true;
})();

// V35 bootstrap: load PDF Layout Studio without mutating portfolio/resume data.
(function () {
    'use strict';

    function hideLegacyPrintButtons() {
        const selectors = [
            '#btn-export-docx',
            '#btn-export-pdf-landscape',
            '[onclick="handleExportDOCX()"]',
            '[onclick="handlePrint(\'landscape\')"]'
        ];
        selectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(disableLegacyButton);
            } catch (err) {
                console.warn('Skipped invalid legacy print selector:', selector, err);
            }
        });
        document.querySelectorAll('button[onclick]').forEach(btn => {
            const action = btn.getAttribute('onclick') || '';
            if (action.includes('handlePrint') && action.includes('landscape')) {
                disableLegacyButton(btn);
            }
        });
    }

    function disableLegacyButton(btn) {
        btn.classList.add('hidden');
        btn.style.display = 'none';
        btn.disabled = true;
        btn.setAttribute('aria-hidden', 'true');
        btn.tabIndex = -1;
    }

    function addStudioButtons() {
        hideLegacyPrintButtons();
        const publicBranch = document.getElementById('public-export-branch');
        if (publicBranch && !document.getElementById('btn-print-designer-studio')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'btn-print-designer-studio';
            btn.title = 'PDF Layout Studio';
            btn.innerHTML = '<i data-lucide="layout-template" class="w-4 h-4"></i><span>Studio</span>';
            btn.onclick = () => window.PrintDesigner && window.PrintDesigner.open ? window.PrintDesigner.open() : alert('Print Designer is not ready.');
            publicBranch.appendChild(btn);
        }

        const exportPanel = document.getElementById('export-panel');
        if (exportPanel && !document.getElementById('btn-print-designer-panel')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'btn-print-designer-panel';
            btn.className = 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all';
            btn.innerHTML = '<i data-lucide="layout-template" class="w-5 h-5"></i> PDF Layout Studio';
            btn.onclick = () => window.PrintDesigner && window.PrintDesigner.open ? window.PrintDesigner.open() : alert('Print Designer is not ready.');
            exportPanel.appendChild(btn);
        }

        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function loadPrintDesignerScript() {
        if (window.PrintDesigner || document.querySelector('script[data-print-designer-v43]')) {
            addStudioButtons();
            return;
        }
        const script = document.createElement('script');
        script.src = 'js/components/PrintDesigner.js?v=43-mobile-studio-final';
        script.defer = true;
        script.dataset.printDesignerV43 = 'true';
        script.onload = () => {
            const hotfix = document.createElement('script');
            hotfix.src = 'js/components/PrintDesignerHotfix.js?v=43-active-data';
            hotfix.defer = true;
            document.body.appendChild(hotfix);
            addStudioButtons();
        };
        script.onerror = () => console.warn('PrintDesigner.js failed to load.');
        document.body.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPrintDesignerScript);
    } else {
        loadPrintDesignerScript();
    }
    setTimeout(addStudioButtons, 1200);
})();
