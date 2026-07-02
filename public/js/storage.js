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
            projectVersion: 'v49',
            resumeVisibility: { profile:true, contact:true, skills:true, summary:true, experience:true, education:true, certifications:true, awards:true, services:true, clients:true, articles:true, caseStudies:true, testimonials:true },
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
                    'Export as web, PDF, or Canva brief with picture frames'
                ],
                highlights_en: [
                    'Add project screenshots from Edit',
                    'Describe measurable results',
                    'Export as web, PDF, or Canva brief with picture frames'
                ],
                images: [
                    'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22900%22%20height%3D%221125%22%20viewBox%3D%220%200%20900%201125%22%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%230b1228%22/%3E%3Cstop%20offset%3D%220.55%22%20stop-color%3D%22%23153a78%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322d3ee%22/%3E%3C/linearGradient%3E%3Cfilter%20id%3D%22glow%22%3E%3CfeGaussianBlur%20stdDeviation%3D%228%22%20result%3D%22b%22/%3E%3CfeMerge%3E%3CfeMergeNode%20in%3D%22b%22/%3E%3CfeMergeNode%20in%3D%22SourceGraphic%22/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%0A%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20rx%3D%2242%22%20fill%3D%22url%28%23g%29%22/%3E%0A%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22812%22%20height%3D%221037%22%20rx%3D%2234%22%20fill%3D%22none%22%20stroke%3D%22rgba%28255%2C255%2C255%2C.42%29%22%20stroke-width%3D%223%22%20stroke-dasharray%3D%2218%2014%22/%3E%0A%3Ccircle%20cx%3D%22702%22%20cy%3D%22270%22%20r%3D%22144%22%20fill%3D%22rgba%28255%2C255%2C255%2C.12%29%22%20filter%3D%22url%28%23glow%29%22/%3E%0A%3Ctext%20x%3D%2270%22%20y%3D%22970%22%20fill%3D%22%23dbeafe%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2256%22%20font-weight%3D%22800%22%3EPIC_FRAME_01%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%221033%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22600%22%3EHero%20/%20project%20cover%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%221077%22%20fill%3D%22%23ffffff%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2226%22%20opacity%3D%22.86%22%3EReplaceable%20picture%20frame%20%E2%80%A2%204%3A5%3C/text%3E%0A%3C/svg%3E',
                    'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221200%22%20height%3D%22760%22%20viewBox%3D%220%200%201200%20760%22%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%230b1228%22/%3E%3Cstop%20offset%3D%220.55%22%20stop-color%3D%22%23153a78%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322d3ee%22/%3E%3C/linearGradient%3E%3Cfilter%20id%3D%22glow%22%3E%3CfeGaussianBlur%20stdDeviation%3D%228%22%20result%3D%22b%22/%3E%3CfeMerge%3E%3CfeMergeNode%20in%3D%22b%22/%3E%3CfeMergeNode%20in%3D%22SourceGraphic%22/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%0A%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20rx%3D%2242%22%20fill%3D%22url%28%23g%29%22/%3E%0A%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%221112%22%20height%3D%22672%22%20rx%3D%2234%22%20fill%3D%22none%22%20stroke%3D%22rgba%28255%2C255%2C255%2C.42%29%22%20stroke-width%3D%223%22%20stroke-dasharray%3D%2218%2014%22/%3E%0A%3Ccircle%20cx%3D%22936%22%20cy%3D%22182%22%20r%3D%22122%22%20fill%3D%22rgba%28255%2C255%2C255%2C.12%29%22%20filter%3D%22url%28%23glow%29%22/%3E%0A%3Ctext%20x%3D%2270%22%20y%3D%22605%22%20fill%3D%22%23dbeafe%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2256%22%20font-weight%3D%22800%22%3EPIC_FRAME_02%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%22668%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22600%22%3EFeatured%20project%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%22712%22%20fill%3D%22%23ffffff%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2226%22%20opacity%3D%22.86%22%3EReplaceable%20picture%20frame%20%E2%80%A2%2016%3A9%3C/text%3E%0A%3C/svg%3E',
                    'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22900%22%20height%3D%22900%22%20viewBox%3D%220%200%20900%20900%22%3E%0A%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%230b1228%22/%3E%3Cstop%20offset%3D%220.55%22%20stop-color%3D%22%23153a78%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322d3ee%22/%3E%3C/linearGradient%3E%3Cfilter%20id%3D%22glow%22%3E%3CfeGaussianBlur%20stdDeviation%3D%228%22%20result%3D%22b%22/%3E%3CfeMerge%3E%3CfeMergeNode%20in%3D%22b%22/%3E%3CfeMergeNode%20in%3D%22SourceGraphic%22/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%0A%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20rx%3D%2242%22%20fill%3D%22url%28%23g%29%22/%3E%0A%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22812%22%20height%3D%22812%22%20rx%3D%2234%22%20fill%3D%22none%22%20stroke%3D%22rgba%28255%2C255%2C255%2C.42%29%22%20stroke-width%3D%223%22%20stroke-dasharray%3D%2218%2014%22/%3E%0A%3Ccircle%20cx%3D%22702%22%20cy%3D%22216%22%20r%3D%22144%22%20fill%3D%22rgba%28255%2C255%2C255%2C.12%29%22%20filter%3D%22url%28%23glow%29%22/%3E%0A%3Ctext%20x%3D%2270%22%20y%3D%22745%22%20fill%3D%22%23dbeafe%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2256%22%20font-weight%3D%22800%22%3EPIC_FRAME_03%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%22808%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2234%22%20font-weight%3D%22600%22%3EGallery%20/%20proof%3C/text%3E%0A%3Ctext%20x%3D%2272%22%20y%3D%22852%22%20fill%3D%22%23ffffff%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2226%22%20opacity%3D%22.86%22%3EReplaceable%20picture%20frame%20%E2%80%A2%201%3A1%3C/text%3E%0A%3C/svg%3E'
                ]
            }]
        };

        if (data) return { ...defaultData, ...data, _hasStoredCache: hasStoredCache };
        return hasStoredCache ? { ...defaultData, _hasStoredCache: true } : { ...defaultData, ...firstRunDemoData, _hasStoredCache: false };
    }
};
