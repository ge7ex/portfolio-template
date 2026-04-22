// js/exporter.js
const Exporter = {
    generatePPT: (data) => {
        let pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE'; // ใช้ Layout 16:9 สำหรับ Portfolio

        const isLight = data.colorMode === 'light';
        const bgColor = isLight ? "FFFFFF" : "0F172A";
        const titleColor = isLight ? "0F172A" : "38BDF8";
        const subColor = isLight ? "475569" : "94A3B8";
        const bodyColor = isLight ? "1E293B" : "E2E8F0";

        const lang = data.lang || 'th';
        const nameText = data[`name_${lang}`] || data.name_th || data.name || "My Portfolio";
        const roleText = data[`role_${lang}`] || data.role_th || data.role || "";
        const bioText = data[`bio_${lang}`] || data.bio_th || data.bio || "";
        const skillsText = data[`skills_${lang}`] || data.skills_th || data.skills || "";

        // 🌟 ฟังก์ชันแปลงปีอัตโนมัติ สำหรับไฟล์ PPTX
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
        slide1.background = { fill: bgColor };

        if (data.avatar) {
            slide1.addImage({
                data: data.avatar,
                x: 3.5, y: 1.0, w: 3, h: 3,
                sizing: { type: 'cover', w: 3, h: 3 },
                rounding: true
            });
        }

        slide1.addText(nameText, {
            x: 0, y: 4.5, w: '100%', align: 'center', fontSize: 48,
            color: titleColor, bold: true
        });
        slide1.addText(roleText, {
            x: 0, y: 5.5, w: '100%', align: 'center', fontSize: 24,
            color: subColor, italic: true
        });

        // ============== Slide 2: Profile & Info ==============
        let slide2 = pres.addSlide();
        slide2.background = { fill: bgColor };

        const aboutTitle = lang === 'th' ? "ประวัติโดยย่อ" : "ABOUT ME";
        slide2.addText(aboutTitle, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });
        slide2.addText(bioText || (lang === 'th' ? "ไม่มีข้อมูลประวัติ" : "No biography provided."), { x: 0.5, y: 1.2, w: '90%', fontSize: 16, color: bodyColor });

        const contactTitle = lang === 'th' ? "ข้อมูลติดต่อ" : "CONTACT INFO";
        slide2.addText(contactTitle, { x: 0.5, y: 4.0, fontSize: 24, bold: true, color: '10B981' });
        const contactStr = `Email: ${data.email || '-'}\nPhone: ${data.phone || '-'}\nLinkedIn: ${data.linkedin || '-'}`;
        slide2.addText(contactStr, { x: 0.5, y: 4.6, w: '90%', fontSize: 14, color: bodyColor });

        // ============== Slide 3: Skills ==============
        let slide3 = pres.addSlide();
        slide3.background = { fill: bgColor };

        const skillTitle = lang === 'th' ? "ทักษะและความเชี่ยวชาญ" : "CORE SKILLS";
        slide3.addText(skillTitle, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });

        let skillsArr = skillsText.split(',').map(s => s.trim()).filter(s => s);
        if (skillsArr.length === 0) {
            slide3.addText(lang === 'th' ? "ไม่มีข้อมูลทักษะ" : "No skills provided.", { x: 0.5, y: 1.2, w: '90%', fontSize: 16, color: bodyColor });
        } else {
            let currentY = 1.2;
            skillsArr.forEach(skill => {
                slide3.addText(`• ${skill}`, { x: 1.0, y: currentY, w: '80%', fontSize: 18, color: bodyColor, bold: true });
                currentY += 0.5;
            });
        }

        // ============== Slide 4: Experience Overview ==============
        if (data.exp && data.exp.length > 0) {
            let slide4 = pres.addSlide();
            slide4.background = { fill: bgColor };
            const expOverviewTitle = lang === 'th' ? "สรุปประสบการณ์ทำงาน" : "EXPERIENCE OVERVIEW";
            slide4.addText(expOverviewTitle, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });

            let currentY = 1.2;
            data.exp.forEach((item, index) => {
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

            // ============== Project Showcase Slides ==============
            data.exp.forEach((item) => {
                const itemTitle = item[`title_${lang}`] || item.title_th || item.title || "";
                const itemHighlights = item[`highlights_${lang}`] || item.highlights_th || item.highlights || [];
                const sy = formatYear(item.startYear || item.year, lang);

                const hasHighlights = itemHighlights && itemHighlights.length > 0;
                const hasImages = item.images && item.images.length > 0;

                // สร้างสไลด์เมื่อมีไฮไลท์หรือมีรูปเท่านั้น
                if (hasHighlights || hasImages) {
                    let pSlide = pres.addSlide();
                    pSlide.background = { fill: bgColor };
                    pSlide.addText(`${lang === 'th' ? 'โปรเจกต์' : 'Project'}: ${itemTitle}`, { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: titleColor });
                    pSlide.addText(`${lang === 'th' ? 'ปี' : 'Year'}: ${sy}`, { x: 0.5, y: 1.0, w: '90%', fontSize: 16, color: '3B82F6', italic: true });

                    let yPos = 1.6;

                    if (hasHighlights) {
                        itemHighlights.forEach(h => {
                            pSlide.addText(`• ${h}`, { x: 0.5, y: yPos, w: hasImages ? '45%' : '90%', fontSize: 16, color: bodyColor });
                            yPos += 0.4;
                        });
                    }

                    if (hasImages) {
                        let imgX = hasHighlights ? 5.5 : 0.5;
                        let imgY = 1.5;
                        let rowHeight = 2.5;

                        item.images.forEach((imgBase64, idx) => {
                            if (idx >= 4) return; // Limit to 4 images per slide

                            pSlide.addImage({
                                data: imgBase64,
                                x: imgX + (idx % 2 === 0 ? 0 : 4.0),
                                y: imgY + (Math.floor(idx / 2) * rowHeight),
                                w: 3.8, h: 2.2,
                                sizing: { type: 'contain' }
                            });
                        });
                    }
                }
            });
        }

        // ============== Save File ==============
        const safeName = (nameText || 'My').replace(/\s+/g, '_');
        pres.writeFile({ fileName: `${safeName}_Portfolio.pptx` });
    }
};