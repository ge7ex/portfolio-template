// js/exporter.js
const Exporter = {
    generatePPT: (data) => {
        let pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE'; // ใช้ Layout 16:9 สำหรับ Portfolio

        const isLight = data.theme === 'resume';
        const bgColor = isLight ? "FFFFFF" : "0F172A";
        const titleColor = isLight ? "0F172A" : "38BDF8";
        const subColor = isLight ? "475569" : "94A3B8";
        const bodyColor = isLight ? "1E293B" : "E2E8F0";

        // ============== Slide 1: Cover ==============
        let slide1 = pres.addSlide();
        slide1.background = { fill: bgColor };
        
        // รูปโปรไฟล์ (ถ้ามีข้อมูลรูปภาพ Base64)
        if (data.avatar) {
            // ดึงเฉพาะ base64 จาก data URI
            slide1.addImage({ 
                data: data.avatar, 
                x: 3.5, y: 1.0, w: 3, h: 3, 
                sizing: { type: 'cover', w: 3, h: 3 }, 
                rounding: true 
            });
        }

        slide1.addText(data.name || "My Portfolio", {
            x: 0, y: 4.5, w: '100%', align: 'center', fontSize: 48,
            color: titleColor, bold: true
        });
        slide1.addText(data.role || "", {
            x: 0, y: 5.5, w: '100%', align: 'center', fontSize: 24,
            color: subColor, italic: true
        });

        // ============== Slide 2: Profile & Info ==============
        let slide2 = pres.addSlide();
        slide2.background = { fill: bgColor };
        
        slide2.addText("ABOUT ME", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });
        slide2.addText(data.bio || "No biography provided.", { x: 0.5, y: 1.2, w: '90%', fontSize: 16, color: bodyColor });
        
        slide2.addText("CONTACT INFO", { x: 0.5, y: 4.0, fontSize: 24, bold: true, color: '10B981' });
        const contactStr = `Email: ${data.email || '-'}\nPhone: ${data.phone || '-'}\nLinkedIn: ${data.linkedin || '-'}`;
        slide2.addText(contactStr, { x: 0.5, y: 4.6, w: '90%', fontSize: 14, color: bodyColor });

        // ============== Slide 3: Skills ==============
        let slide3 = pres.addSlide();
        slide3.background = { fill: bgColor };
        
        slide3.addText("CORE SKILLS", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });
        
        let skillsArr = (data.skills || "").split(',').map(s => s.trim()).filter(s => s);
        if (skillsArr.length === 0) {
            slide3.addText("No skills provided.", { x: 0.5, y: 1.2, w: '90%', fontSize: 16, color: bodyColor });
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
            slide4.addText("EXPERIENCE OVERVIEW", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '3B82F6' });
            
            let currentY = 1.2;
            data.exp.forEach((item, index) => {
                 if (currentY > 6.5) return;
                 slide4.addText(`${item.year} | ${item.title}`, { x: 0.5, y: currentY, fontSize: 18, bold: true, color: titleColor });
                 currentY += 0.4;
                 if (item.desc) {
                     slide4.addText(item.desc, { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: subColor });
                     currentY += Math.max(0.6, (item.desc.length / 100) * 0.4);
                 } else {
                     currentY += 0.2;
                 }
            });

            // ============== Project Showcase Slides ==============
            data.exp.forEach((item) => {
                const hasHighlights = item.highlights && item.highlights.length > 0;
                const hasImages = item.images && item.images.length > 0;
                
                // Only create detailed slide if there are images or highlights
                if (hasHighlights || hasImages) {
                    let pSlide = pres.addSlide();
                    pSlide.background = { fill: bgColor };
                    pSlide.addText(`Project: ${item.title}`, { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: titleColor });
                    pSlide.addText(`Year: ${item.year}`, { x: 0.5, y: 1.0, w: '90%', fontSize: 16, color: '3B82F6', italic: true });
                    
                    let yPos = 1.6;
                    
                    if (hasHighlights) {
                        item.highlights.forEach(h => {
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
        const safeName = (data.name || 'My').replace(/\s+/g, '_');
        pres.writeFile({ fileName: `${safeName}_Portfolio.pptx` });
    }
};