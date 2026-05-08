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
            projectVersion: 'v38',
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
