// js/storage.js
const StorageHandler = {
    save: (data) => {
        try {
            // 🌟 1. Auto-Sort Algorithm: เรียงลำดับประสบการณ์ (ใหม่ -> เก่า) อัตโนมัติก่อนเซฟ
            if (data.exp && Array.isArray(data.exp)) {
                const monthMap = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12, '': 0 };

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

            localStorage.setItem('ai-portfolio-pro-cache', JSON.stringify(data));
            console.log("Data saved & sorted successfully!");
        } catch (e) {
            console.error("Storage Error:", e);
            // 🌟 แจ้งเตือนกรณีพื้นที่เต็ม (มักเกิดในมือถือถ้ารูปใหญ่เกินไป)
            alert("บันทึกข้อมูลไม่สำเร็จ: พื้นที่จัดเก็บข้อมูลเต็ม (ไฟล์รูปภาพอาจจะใหญ่หรือเยอะเกินไป กรุณาลบรูปที่ไม่ใช้ออก)");
        }
    },
    load: () => {
        let data = null;

        // 🌟 2. Injected Data Check: ตรวจสอบว่ามีข้อมูลฝังอยู่ในไฟล์ HTML หรือไม่ (สำหรับเวอร์ชันดาวน์โหลดลงเครื่อง)
        if (typeof window !== 'undefined' && window.INJECTED_PORTFOLIO_DATA) {
            data = window.INJECTED_PORTFOLIO_DATA;
            console.log("Loaded data from Injected Script");
        } else {
            const d = localStorage.getItem('ai-portfolio-pro-cache');
            data = d ? JSON.parse(d) : null;
            console.log("Loaded data from LocalStorage");
        }

        // 🌟 3. Migration: แปลงข้อมูลระบบเก่า ให้รองรับ 2 ภาษาอัตโนมัติ (ป้องกันข้อมูลเดิมหาย)
        if (data) {
            if (data.theme) { data.layout = data.theme; delete data.theme; }

            if (data.name && !data.name_th) {
                data.name_th = data.name; data.name_en = data.name;
                data.role_th = data.role; data.role_en = data.role;
                data.bio_th = data.bio; data.bio_en = data.bio;
                data.skills_th = data.skills; data.skills_en = data.skills;

                if (data.exp) {
                    data.exp = data.exp.map(e => ({
                        ...e,
                        company_th: e.company || '', company_en: e.company || '',
                        title_th: e.title || '', title_en: e.title || '',
                        desc_th: e.desc || '', desc_en: e.desc || '',
                        highlights_th: e.highlights || [], highlights_en: e.highlights || []
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
            lang: 'th', // เริ่มต้นที่ภาษาไทย
            skills_th: 'AI Strategy, Web Architecture, SEO',
            skills_en: 'AI Strategy, Web Architecture, SEO',
            email: '', phone: '', linkedin: '', avatar: '',
            exp: []
        };

        return data ? { ...defaultData, ...data } : defaultData;
    }
};