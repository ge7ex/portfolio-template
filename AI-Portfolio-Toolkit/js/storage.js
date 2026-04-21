// js/storage.js
const StorageHandler = {
    save: (data) => {
        try {
            localStorage.setItem('ai-portfolio-pro-cache', JSON.stringify(data));
            console.log("Data saved successfully!");
        } catch (e) {
            console.error("Storage Error:", e);
        }
    },
    load: () => {
        const d = localStorage.getItem('ai-portfolio-pro-cache');
        let data = d ? JSON.parse(d) : null;

        // 🌟 Migration: แปลงข้อมูลระบบเก่า ให้รองรับ 2 ภาษาอัตโนมัติ (ป้องกันข้อมูลเดิมหาย)
        if (data) {
            if (data.theme) { data.layout = data.theme; delete data.theme; }

            // ถ้ามีชื่อเดิม แต่ยังไม่มีชื่อไทย แปลว่ามาจากเวอร์ชันเก่า ให้ก็อปปี้ข้อมูลแยกลง 2 ฝั่ง
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
            exp: [
                {
                    startMonth: 'Jan', startYear: '2024', endMonth: '', endYear: '', isCurrent: true,
                    company_th: 'บริษัท/หน่วยงาน ตัวอย่าง', company_en: 'Sample Company',
                    title_th: 'ตัวอย่างโปรเจกต์', title_en: 'Project Example',
                    desc_th: 'รายละเอียดผลงานเบื้องต้นของคุณ...', desc_en: 'Brief description of your role...',
                    highlights_th: ['วางแผนจัดทำและพัฒนาระบบ'], highlights_en: ['System Development and Planning'],
                    images: []
                }
            ]
        };

        return data ? { ...defaultData, ...data } : defaultData;
    }
};