// js/exporter.js
const Exporter = {
    generatePPT: (data) => {
        let pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE'; // ใช้ Layout 16:9 สำหรับ Portfolio

        const isLight = data.colorMode === 'light';
        const pStyle = data.portfolioStyle || 'tech';

        // 🌟 1. ธีมสีข้อความ (Text Colors) ตรงตาม 8 ธีมของเว็บ
        const themeColors = {
            tech: { accent: "3B82F6", sub: "60A5FA" },
            educ: { accent: "10B981", sub: "34D399" },
            gov: { accent: "F59E0B", sub: "FBBF24" },
            creative: { accent: "D946EF", sub: "E879F9" },
            minimal: { accent: isLight ? "000000" : "FFFFFF", sub: "71717A" },
            eco: { accent: "14B8A6", sub: "2DD4BF" },
            bold: { accent: "F43F5E", sub: "FB7185" },
            luxury: { accent: "FBBF24", sub: "FCD34D" }
        };

        // 🌟 2. ธีมสีพื้นหลังสำรอง (Exact Hex Colors) ในกรณีที่สแนปช็อตภาพล้มเหลว
        const themeBgColors = {
            tech: { dark: "020617", light: "F8FAFC" },
            educ: { dark: "022C22", light: "ECFDF5" },
            gov: { dark: "0F172A", light: "F1F5F9" },
            creative: { dark: "2E1065", light: "FDF4FF" },
            minimal: { dark: "000000", light: "FFFFFF" },
            eco: { dark: "042F2E", light: "F0FDFA" },
            bold: { dark: "450A0A", light: "FFF1F2" },
            luxury: { dark: "1E1B4B", light: "EEF2FF" }
        };

        const currentTheme = themeColors[pStyle] || themeColors.tech;
        const exactBgHex = themeBgColors[pStyle] ? themeBgColors[pStyle][data.colorMode] : (isLight ? "FFFFFF" : "020617");

        // 🌟 3. ตั้งค่า Background: ใช้รูปภาพสแนปช็อตเป็นหลัก ถ้าไม่มีให้ใช้สี Hex ตรงตามธีม
        const bgConfig = data.bgSnapshot ? { data: data.bgSnapshot } : { fill: exactBgHex };

        const titleColor = currentTheme.accent;
        const subColor = currentTheme.sub;
        const bodyColor = isLight ? "1E293B" : "E2E8F0";

        const lang = data.lang || 'th';
        const nameText = data[`name_${lang}`] || data.name_th || data.name || "My Portfolio";
        const roleText = data[`role_${lang}`] || data.role_th || data.role || "";
        const bioText = data[`bio_${lang}`] || data.bio_th || data.bio || "";
        const skillsText = data[`skills_${lang}`] || data.skills_th || data.skills || "";

        const formatYear = (yStr, targetLang) => {
            if (!yStr) return '';
            const y = parseInt(yStr);
            if (isNaN(y)) return yStr;
            if (targetLang === 'th' && y < 2500) return (y + 543).toString();
            if (targetLang === 'en' && y >= 2500) return (y - 543).toString();
            return y.toString();
        };

        // ============== Slide 1: Cover ==============
        let slide1 = pres.addSlide();
        slide1.background = bgConfig; // ใส่ Background

        if (data.avatar) {
            slide1.addImage({ data: data.avatar, x: 4.15, y: 1.0, w: 2.5, h: 2.5, sizing: { type: 'cover', w: 2.5, h: 2.5 }, rounding: true });
        }
        slide1.addText(nameText, { x: 0, y: 4.0, w: '100%', align: 'center', fontSize: 44, color: titleColor, bold: true });
        slide1.addText(roleText, { x: 0, y: 4.8, w: '100%', align: 'center', fontSize: 22, color: subColor });

        // ============== Slide 2: Bio & Contact ==============
        let slide2 = pres.addSlide();
        slide2.background = bgConfig; // ใส่ Background

        // 🌟 แก้ไข: ใช้ titleColor แทนโค้ดสีที่ Hardcode ไว้
        slide2.addText(lang === 'th' ? "ประวัติโดยย่อ" : "ABOUT ME", { x: 0.5, y: 0.5, w: '45%', fontSize: 32, color: titleColor, bold: true });
        slide2.addText(bioText || "...", { x: 0.5, y: 1.2, w: '45%', h: 4, fontSize: 16, color: bodyColor, valign: 'top' });

        slide2.addText(lang === 'th' ? "ข้อมูลติดต่อ" : "CONTACT INFO", { x: 5.5, y: 0.5, w: '40%', fontSize: 32, color: titleColor, bold: true });
        const contactStr = `Email: ${data.email || '-'}\nPhone: ${data.phone || '-'}\nLinkedIn: ${data.linkedin || '-'}`;
        slide2.addText(contactStr, { x: 5.5, y: 1.2, w: '40%', h: 4, fontSize: 16, color: bodyColor, valign: 'top' });

        // ============== Slide 3: Skills ==============
        let slide3 = pres.addSlide();
        slide3.background = bgConfig; // ใส่ Background

        // 🌟 แก้ไข: ใช้ titleColor แทนโค้ดสีที่ Hardcode ไว้
        slide3.addText(lang === 'th' ? "ทักษะและความเชี่ยวชาญ" : "CORE SKILLS", { x: 0.5, y: 0.5, fontSize: 32, color: titleColor, bold: true });
        let skillsArr = skillsText.split(',').map(s => s.trim()).filter(s => s);
        if (skillsArr.length > 0) {
            let currentY = 1.2;
            skillsArr.forEach((skill, idx) => {
                if (idx > 10) return;
                slide3.addText(`• ${skill}`, { x: 0.8, y: currentY, w: '80%', fontSize: 18, color: bodyColor });
                currentY += 0.5;
            });
        }

        // ============== Slide 4+: Experience ==============
        if (data.exp && data.exp.length > 0) {
            // หน้า Overview
            let slide4 = pres.addSlide();
            slide4.background = bgConfig; // ใส่ Background
            slide4.addText(lang === 'th' ? "สรุปประสบการณ์ทำงาน" : "EXPERIENCE OVERVIEW", { x: 0.5, y: 0.5, fontSize: 32, color: titleColor, bold: true });

            let currentY = 1.2;
            data.exp.forEach((item) => {
                if (currentY > 6.5) return;
                const itemTitle = item[`title_${lang}`] || item.title_th || item.title || "";
                const itemDesc = item[`desc_${lang}`] || item.desc_th || item.desc || "";
                const sy = formatYear(item.startYear || item.year, lang);

                slide4.addText(`${sy} | ${itemTitle}`, { x: 0.5, y: currentY, fontSize: 18, bold: true, color: titleColor });
                currentY += 0.4;
                if (itemDesc) {
                    slide4.addText(itemDesc, { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: subColor });
                    currentY += Math.max(0.6, (itemDesc.length / 100) * 0.4);
                } else {
                    currentY += 0.2;
                }
            });

            // หน้า Project Showcase (แต่ละชิ้นงาน)
            data.exp.forEach((e) => {
                const itemHighlights = e[`highlights_${lang}`] || e.highlights_th || e.highlights || [];
                let hasImages = e.images && e.images.length > 0;
                let hasHighlights = itemHighlights.length > 0;

                // สร้างสไลด์เมื่อมีไฮไลท์หรือรูปเท่านั้น
                if (hasHighlights || hasImages) {
                    let pSlide = pres.addSlide();
                    pSlide.background = bgConfig; // ใส่ Background

                    const itemTitle = e[`title_${lang}`] || e.title_th || e.title || "";
                    const itemCompany = e[`company_${lang}`] || e.company_th || e.company || "";
                    const sy = formatYear(e.startYear || e.year, lang);
                    const ey = formatYear(e.endYear, lang);
                    const dateDisplay = e.isCurrent ? (lang === 'th' ? `${sy} - ปัจจุบัน` : `${sy} - Present`) : (ey ? `${sy} - ${ey}` : sy);

                    pSlide.addText(itemTitle, { x: 0.5, y: 0.5, w: '90%', fontSize: 26, color: titleColor, bold: true });

                    // 🌟 แก้ไข: ใช้ subColor แทนสีที่ Hardcode ไว้
                    pSlide.addText(`${dateDisplay} | ${itemCompany}`, { x: 0.5, y: 1.0, w: '90%', fontSize: 15, color: subColor, italic: true });

                    let yPos = 1.6;
                    itemHighlights.forEach((h, idx) => {
                        if (idx > 5) return;
                        pSlide.addText(`• ${h}`, { x: 0.5, y: yPos, w: hasImages ? '45%' : '90%', fontSize: 15, color: bodyColor });
                        yPos += 0.5;
                    });

                    if (hasImages) {
                        e.images.slice(0, 4).forEach((img, idx) => {
                            pSlide.addImage({ data: img, x: 5.5 + (idx % 2 === 0 ? 0 : 3.6), y: 1.5 + (Math.floor(idx / 2) * 2.1), w: 3.4, h: 1.9, sizing: { type: 'contain' } });
                        });
                    }
                }
            });
        }

        const safeName = (data.name_en || data.name_th || 'My').replace(/\s+/g, '_');
        pres.writeFile({ fileName: `${safeName}_Portfolio.pptx` });
    }
};