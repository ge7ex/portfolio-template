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
            if (typeof window !== 'undefined' && window.INJECTED_PORTFOLIO_DATA) {
                window.INJECTED_PORTFOLIO_DATA = data;
            }

            localStorage.setItem('ai-portfolio-pro-cache', JSON.stringify(data));
            console.log("Data saved & sorted successfully!");

        } catch (e) {
            console.error("Storage Error:", e);
            alert("บันทึกข้อมูลไม่สำเร็จ: พื้นที่จัดเก็บข้อมูลเต็ม (ไฟล์รูปภาพอาจจะใหญ่หรือเยอะเกินไป กรุณาลบรูปที่ไม่ใช้ออก)");
        }
    },

    load: () => {
        let data = null;

        // 🌟 เช็คว่าเป็นการเปิดจากไฟล์ที่ดาวน์โหลดไปหรือไม่
        if (typeof window !== 'undefined' && window.INJECTED_PORTFOLIO_DATA) {
            data = window.INJECTED_PORTFOLIO_DATA;
        } else {
            const d = localStorage.getItem('ai-portfolio-pro-cache');
            data = d ? JSON.parse(d) : null;
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

        const extraExampleData = {
            education_th: 'ปริญญาตรี วิทยาการคอมพิวเตอร์ | มหาวิทยาลัยตัวอย่าง | 2565 | เกียรตินิยมอันดับสอง',
            education_en: 'B.Sc. Computer Science | Example University | 2022 | Second-class honors',
            certifications_th: 'AI Product Strategy | Example Academy | 2566\nUX Research Foundation | Design Institute | 2565',
            certifications_en: 'AI Product Strategy | Example Academy | 2023\nUX Research Foundation | Design Institute | 2022',
            awards_th: 'รางวัลนวัตกรรมดิจิทัล | สมาคมเทคโนโลยีตัวอย่าง | 2566 | ทีมพัฒนาเครื่องมืออัตโนมัติสำหรับองค์กร',
            awards_en: 'Digital Innovation Award | Example Technology Association | 2023 | Built an automation toolkit for enterprise teams',
            caseStudies_th: 'Gov Service Portal | ขั้นตอนสมัครซับซ้อนและใช้เวลานาน | ออกแบบ flow ใหม่พร้อม dashboard ติดตามสถานะ | ลดเวลาทำงานลง 35%',
            caseStudies_en: 'Gov Service Portal | Complex and slow application flow | Redesigned the flow with a status dashboard | Reduced operation time by 35%',
            services_th: 'AI Portfolio Setup | จัดโครงสร้างโปรไฟล์และไฟล์นำเสนอให้พร้อมใช้\nResume / PDF Print Fix | ปรับ layout สำหรับพิมพ์จริงและส่งงาน',
            services_en: 'AI Portfolio Setup | Structure a professional profile and presentation pack\nResume / PDF Print Fix | Tune layouts for real printing and submission',
            testimonials_th: 'ทำงานเป็นระบบ เข้าใจโจทย์ และส่งไฟล์พร้อมใช้งานจริง | คุณตัวอย่าง | Project Owner',
            testimonials_en: 'Clear process, sharp thinking, and files that were ready to use. | Alex Example | Project Owner',
            clients_th: 'Example Agency, Demo University, Gov Innovation Lab',
            clients_en: 'Example Agency, Demo University, Gov Innovation Lab',
            cta_th: '',
            cta_en: '',
            articles_th: 'แนวทางออกแบบ Portfolio สำหรับ AI Workflow | บทความสรุปวิธีจัดข้อมูลให้อ่านง่ายและนำไปใช้ต่อได้ | https://example.com/article',
            articles_en: 'Designing a Portfolio for AI Workflows | A practical note on structuring content for reuse and clarity | https://example.com/article'
        };

        const extraKeys = Object.keys(extraExampleData);

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
            extraExamplesSeeded: false,
            email: '', phone: '', linkedin: '', avatar: '',
            exp: []
        };

        const merged = data ? { ...defaultData, ...data } : { ...defaultData };
        const hasAnyExtraContent = extraKeys.some(key => String(merged[key] || '').trim());
        if (!hasAnyExtraContent && !merged.extraExamplesSeeded) {
            return { ...merged, ...extraExampleData, extraExamplesSeeded: true };
        }
        return merged;
    }
};
