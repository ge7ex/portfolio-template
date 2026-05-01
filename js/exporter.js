// js/exporter.js
const Exporter = {
    generatePPT: (data) => {
        let pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE';

        const isLight = data.colorMode === 'light';
        const pStyle = data.portfolioStyle || 'tech';

        // 🌟 แมประดับสีตาม 8 ธีมของเราให้ตรงกันเป๊ะ
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

        // 🌟 ถ้าระบบจับภาพหน้าจอได้ ให้ปูเป็นพื้นหลัง ถ้าจับไม่ได้ ให้ใช้สี Hex
        const bgConfig = data.bgSnapshot ? { data: data.bgSnapshot } : { fill: exactBgHex };

        const addThemeBackground = (slide) => {
            if (data.bgSnapshot) return;
            const rect = pres.ShapeType.rect;
            const ellipse = pres.ShapeType.ellipse;
            slide.addShape(rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: exactBgHex }, line: { color: exactBgHex, transparency: 100 } });
            slide.addShape(ellipse, { x: -1.2, y: 4.7, w: 4.2, h: 4.2, fill: { color: currentTheme.accent, transparency: 78 }, line: { color: currentTheme.accent, transparency: 100 } });
            slide.addShape(ellipse, { x: 9.8, y: -1.1, w: 4.6, h: 4.6, fill: { color: currentTheme.sub, transparency: 82 }, line: { color: currentTheme.sub, transparency: 100 } });
            slide.addShape(rect, { x: 0, y: 0, w: 13.333, h: 0.12, fill: { color: currentTheme.accent, transparency: 18 }, line: { color: currentTheme.accent, transparency: 100 } });
            if (pStyle === "bold") {
                slide.addShape(rect, { x: 10.25, y: 0, w: 3.08, h: 7.5, fill: { color: "7F1D1D", transparency: 28 }, line: { color: "7F1D1D", transparency: 100 } });
                slide.addShape(ellipse, { x: 7.8, y: 4.9, w: 5.3, h: 5.3, fill: { color: "FB7185", transparency: 76 }, line: { color: "FB7185", transparency: 100 } });
            }
        };

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
        slide1.background = bgConfig; addThemeBackground(slide1);

        if (data.avatar) {
            slide1.addImage({ data: data.avatar, x: 4.15, y: 1.0, w: 2.5, h: 2.5, sizing: { type: 'cover', w: 2.5, h: 2.5 }, rounding: true });
        }
        slide1.addText(nameText, { x: 0, y: 4.0, w: '100%', align: 'center', fontSize: 44, color: titleColor, bold: true });
        slide1.addText(roleText, { x: 0, y: 4.8, w: '100%', align: 'center', fontSize: 22, color: subColor });

        // ============== Slide 2: Bio & Contact ==============
        let slide2 = pres.addSlide();
        slide2.background = bgConfig; addThemeBackground(slide2);

        slide2.addText(lang === 'th' ? "ประวัติโดยย่อ" : "ABOUT ME", { x: 0.5, y: 0.5, w: '45%', fontSize: 32, color: titleColor, bold: true });
        slide2.addText(bioText || "...", { x: 0.5, y: 1.2, w: '45%', h: 4, fontSize: 16, color: bodyColor, valign: 'top' });

        slide2.addText(lang === 'th' ? "ข้อมูลติดต่อ" : "CONTACT INFO", { x: 5.5, y: 0.5, w: '40%', fontSize: 32, color: titleColor, bold: true });
        const contactStr = `Email: ${data.email || '-'}
Phone: ${data.phone || '-'}
LinkedIn: ${data.linkedin || '-'}`;
        slide2.addText(contactStr, { x: 5.5, y: 1.2, w: '40%', h: 4, fontSize: 16, color: bodyColor, valign: 'top' });

        // ============== Slide 3: Skills ==============
        let slide3 = pres.addSlide();
        slide3.background = bgConfig; addThemeBackground(slide3);

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
            let slide4 = pres.addSlide();
            slide4.background = bgConfig; addThemeBackground(slide4);
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

            data.exp.forEach((e) => {
                const itemHighlights = e[`highlights_${lang}`] || e.highlights_th || e.highlights || [];
                let hasImages = e.images && e.images.length > 0;
                let hasHighlights = itemHighlights.length > 0;

                if (hasHighlights || hasImages) {
                    let pSlide = pres.addSlide();
                    pSlide.background = bgConfig; addThemeBackground(pSlide);

                    const itemTitle = e[`title_${lang}`] || e.title_th || e.title || "";
                    const itemCompany = e[`company_${lang}`] || e.company_th || e.company || "";
                    const sy = formatYear(e.startYear || e.year, lang);
                    const ey = formatYear(e.endYear, lang);
                    const dateDisplay = e.isCurrent ? (lang === 'th' ? `${sy} - ปัจจุบัน` : `${sy} - Present`) : (ey ? `${sy} - ${ey}` : sy);

                    pSlide.addText(itemTitle, { x: 0.5, y: 0.5, w: '90%', fontSize: 26, color: titleColor, bold: true });
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
,

    generateDOCX: (data) => {
        const lang = data.lang || 'th';
        const isResume = (data.layout || 'portfolio') === 'resume';
        const pStyle = data.portfolioStyle || 'tech';
        const safeXml = (v) => String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

        const theme = {
            tech:{accent:'2563EB',accent2:'38BDF8',dark:'0F172A',side:'1D4ED8',soft:'EFF6FF',text:'0F172A'},
            educ:{accent:'059669',accent2:'34D399',dark:'064E3B',side:'047857',soft:'ECFDF5',text:'0F172A'},
            gov:{accent:'D97706',accent2:'FBBF24',dark:'78350F',side:'B45309',soft:'FFFBEB',text:'0F172A'},
            creative:{accent:'C026D3',accent2:'F0ABFC',dark:'581C87',side:'A21CAF',soft:'FDF4FF',text:'0F172A'},
            minimal:{accent:'334155',accent2:'94A3B8',dark:'0F172A',side:'1F2937',soft:'F8FAFC',text:'0F172A'},
            eco:{accent:'0D9488',accent2:'2DD4BF',dark:'134E4A',side:'0F766E',soft:'F0FDFA',text:'0F172A'},
            bold:{accent:'E11D48',accent2:'FB7185',dark:'7F1D1D',side:'BE123C',soft:'FFF1F2',text:'0F172A'},
            luxury:{accent:'B45309',accent2:'FBBF24',dark:'312E81',side:'92400E',soft:'FFFBEB',text:'0F172A'}
        }[pStyle] || {accent:'0D9488',accent2:'2DD4BF',dark:'0F172A',side:'0F766E',soft:'F0FDFA',text:'0F172A'};

        const name = data[`name_${lang}`] || data.name_th || data.name_en || 'My Portfolio';
        const role = data[`role_${lang}`] || data.role_th || data.role_en || '';
        const bio = data[`bio_${lang}`] || data.bio_th || data.bio_en || '';
        const skills = (data[`skills_${lang}`] || data.skills_th || data.skills_en || '').split(',').map(s => s.trim()).filter(Boolean);
        const exp = data.exp || [];

        const pickText = (key) => data[`${key}_${lang}`] || data[`${key}_th`] || data[`${key}_en`] || '';
        const pick = (item, key) => item[`${key}_${lang}`] || item[`${key}_th`] || item[`${key}_en`] || item[key] || '';
        const highlightsOf = (item) => item[`highlights_${lang}`] || item.highlights_th || item.highlights_en || item.highlights || [];
        const formatYear = (yStr) => { if (!yStr) return ''; const y = parseInt(yStr, 10); if (Number.isNaN(y)) return yStr; if (lang === 'th' && y < 2500) return String(y + 543); if (lang === 'en' && y >= 2500) return String(y - 543); return String(y); };
        const dateText = (item) => { const start = `${item.startMonth || ''} ${formatYear(item.startYear || item.year)}`.trim(); const end = item.isCurrent ? (lang === 'th' ? 'ปัจจุบัน' : 'Present') : `${item.endMonth || ''} ${formatYear(item.endYear)}`.trim(); return end ? `${start} - ${end}` : start; };

        const labels = {
            contact: lang === 'th' ? 'ข้อมูลติดต่อ' : 'CONTACT',
            profile: lang === 'th' ? 'ประวัติโดยย่อ' : 'PROFILE',
            skills: lang === 'th' ? 'ทักษะและความเชี่ยวชาญ' : 'SKILLS',
            exp: lang === 'th' ? 'ประสบการณ์และผลงาน' : 'EXPERIENCE & PROJECTS',
            education: lang === 'th' ? 'การศึกษา' : 'EDUCATION',
            certifications: lang === 'th' ? 'ประกาศนียบัตร' : 'CERTIFICATIONS',
            awards: lang === 'th' ? 'รางวัล' : 'AWARDS',
            caseStudies: lang === 'th' ? 'กรณีศึกษา' : 'CASE STUDIES',
            services: lang === 'th' ? 'บริการ' : 'SERVICES',
            testimonials: lang === 'th' ? 'คำรับรอง' : 'TESTIMONIALS',
            clients: lang === 'th' ? 'ลูกค้า / หน่วยงาน' : 'CLIENTS / PARTNERS',
            articles: lang === 'th' ? 'บทความ / ผลงานเผยแพร่' : 'ARTICLES / PUBLICATIONS',
            cta: lang === 'th' ? 'คำเชิญชวน' : 'CALL TO ACTION'
        };

        const r = (text, opts={}) => `<w:r><w:rPr><w:rFonts w:ascii="${opts.font || 'Aptos'}" w:hAnsi="${opts.font || 'Aptos'}" w:eastAsia="${opts.eastFont || 'Aptos'}"/>${opts.bold?'<w:b/>':''}${opts.italic?'<w:i/>':''}<w:color w:val="${opts.color || theme.text}"/><w:sz w:val="${opts.size || 22}"/></w:rPr><w:t xml:space="preserve">${safeXml(text)}</w:t></w:r>`;
        const pPara = (runs, opts={}) => `<w:p><w:pPr>${opts.align?`<w:jc w:val="${opts.align}"/>`:''}${opts.before||opts.after?`<w:spacing w:before="${opts.before||0}" w:after="${opts.after||80}"/>`:''}${opts.bdr?`<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="${opts.bdr}"/></w:pBdr>`:''}</w:pPr>${Array.isArray(runs)?runs.join(''):runs}</w:p>`;
        const heading = (text) => pPara(r(text,{bold:true,color:theme.accent,size:26}), {before:260, after:120, bdr:theme.accent});
        const bullet = (text, color=theme.text) => `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="60"/></w:pPr>${r(text,{color})}</w:p>`;
        const shaded = (text, fill=theme.soft, color=theme.text, size=22) => `<w:p><w:pPr><w:shd w:fill="${fill}"/><w:spacing w:before="100" w:after="100"/></w:pPr>${r('  '+text,{color,size,bold:true})}</w:p>`;

        const lines = (text) => String(text || '').split('\n').map(x => x.trim()).filter(Boolean);
        const sectionPlain = (label, text) => {
            const arr = lines(text);
            if (!arr.length) return '';
            return heading(label) + arr.map(x => pPara(r(x), {after:80})).join('');
        };
        const sectionCards = (label, text) => {
            const arr = lines(text);
            if (!arr.length) return '';
            return heading(label) + arr.map(x => shaded(x, theme.soft, theme.text)).join('');
        };

        const contactText = [data.email, data.phone, data.linkedin].filter(Boolean).join('  |  ');
        let extraBody = '';
        extraBody += sectionPlain(labels.education, pickText('education'));
        extraBody += sectionPlain(labels.certifications, pickText('certifications'));
        extraBody += sectionPlain(labels.awards, pickText('awards'));
        extraBody += sectionCards(labels.caseStudies, pickText('caseStudies'));
        extraBody += sectionCards(labels.services, pickText('services'));
        extraBody += sectionPlain(labels.testimonials, pickText('testimonials'));
        extraBody += sectionPlain(labels.clients, pickText('clients'));
        extraBody += sectionPlain(labels.articles, pickText('articles'));

        let expBody = '';
        if (exp.length) {
            expBody += heading(labels.exp);
            exp.forEach(item => {
                const title = pick(item,'title');
                if (!title && !pick(item,'desc') && !highlightsOf(item).length) return;
                expBody += pPara(r(title || '-', {bold:true,size:26,color:theme.text}), {before:160, after:40});
                expBody += pPara(r(`${dateText(item)}${pick(item,'company') ? ' | ' + pick(item,'company') : ''}`, {italic:true,color:theme.accent,bold:true}), {after:60});
                if (pick(item,'desc')) expBody += pPara(r(pick(item,'desc'), {color:'334155'}), {after:80});
                highlightsOf(item).forEach(h => expBody += bullet(h));
            });
        }

        let body = '';
        if (isResume) {
            const sidebar = [
                pPara(r(name,{bold:true,color:'FFFFFF',size:36}), {after:80}),
                role ? pPara(r(role,{color:'E0F2FE',size:22,bold:true}), {after:220}) : '',
                pPara(r(labels.contact,{bold:true,color:'FFFFFF',size:24}), {before:180,after:80,bdr:'FFFFFF'}),
                contactText ? pPara(r(contactText,{color:'FFFFFF',size:20}), {after:180}) : '',
                skills.length ? pPara(r(labels.skills,{bold:true,color:'FFFFFF',size:24}), {before:180,after:80,bdr:'FFFFFF'}) : '',
                ...skills.map(sk => pPara(r('• '+sk,{color:'FFFFFF',size:20}), {after:50}))
            ].join('');
            const main = [
                bio ? heading(labels.profile) + pPara(r(bio,{color:'334155'}), {after:120}) : '',
                expBody,
                extraBody
            ].join('');
            body = `<w:tbl><w:tblPr><w:tblW w:w="10000" w:type="pct"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tr><w:tc><w:tcPr><w:tcW w:w="3100" w:type="pct"/><w:shd w:fill="${theme.side}"/><w:tcMar><w:top w:w="360" w:type="dxa"/><w:left w:w="320" w:type="dxa"/><w:bottom w:w="360" w:type="dxa"/><w:right w:w="320" w:type="dxa"/></w:tcMar></w:tcPr>${sidebar}</w:tc><w:tc><w:tcPr><w:tcW w:w="6900" w:type="pct"/><w:shd w:fill="FFFFFF"/><w:tcMar><w:top w:w="360" w:type="dxa"/><w:left w:w="420" w:type="dxa"/><w:bottom w:w="360" w:type="dxa"/><w:right w:w="420" w:type="dxa"/></w:tcMar></w:tcPr>${main}</w:tc></w:tr></w:tbl>`;
        } else {
            body += `<w:p><w:pPr><w:shd w:fill="${theme.dark}"/><w:jc w:val="center"/><w:spacing w:before="360" w:after="180"/></w:pPr>${r(name,{bold:true,color:'FFFFFF',size:44})}</w:p>`;
            if (role) body += `<w:p><w:pPr><w:shd w:fill="${theme.dark}"/><w:jc w:val="center"/><w:spacing w:after="360"/></w:pPr>${r(role,{bold:true,color:theme.accent2,size:24})}</w:p>`;
            if (bio) body += heading(labels.profile) + shaded(bio, theme.soft, theme.text);
            if (contactText) body += heading(labels.contact) + pPara(r(contactText,{color:'334155'}), {after:100});
            if (skills.length) body += heading(labels.skills) + shaded(skills.join('  •  '), theme.soft, theme.text);
            body += expBody + extraBody;
        }

        const pageSz = isResume
            ? '<w:pgSz w:w="11906" w:h="16838"/>'
            : '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>';
        const pageBackground = `<w:background w:color="${isResume ? 'FFFFFF' : theme.soft}"/>`;
        const pageBorders = `<w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="18" w:space="18" w:color="${theme.accent}"/><w:left w:val="single" w:sz="18" w:space="18" w:color="${theme.accent}"/><w:bottom w:val="single" w:sz="18" w:space="18" w:color="${theme.accent}"/><w:right w:val="single" w:sz="18" w:space="18" w:color="${theme.accent}"/></w:pgBorders>`;
        const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${pageBackground}<w:body>${body}<w:sectPr>${pageSz}<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>${pageBorders}</w:sectPr></w:body></w:document>`;
        const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:eastAsia="Aptos"/><w:sz w:val="22"/></w:rPr></w:style></w:styles>`;
        const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

        const files = {
            '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`,
            '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
            'word/_rels/document.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`,
            'word/document.xml': documentXml,
            'word/styles.xml': stylesXml,
            'word/numbering.xml': numberingXml
        };

        const crcTable = (() => { let c, t=[]; for(let n=0;n<256;n++){ c=n; for(let k=0;k<8;k++) c=((c&1)?(0xEDB88320^(c>>>1)):(c>>>1)); t[n]=c>>>0; } return t; })();
        const crc32 = (u8) => { let c=0xffffffff; for(let i=0;i<u8.length;i++) c=crcTable[(c^u8[i])&0xff]^(c>>>8); return (c^0xffffffff)>>>0; };
        const enc = new TextEncoder();
        const chunks = []; const central = []; let offset=0;
        const u16 = n => new Uint8Array([n&255,(n>>>8)&255]);
        const u32 = n => new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);
        Object.entries(files).forEach(([fileName, content]) => {
            const nameBytes = enc.encode(fileName); const dataBytes = enc.encode(content); const crc = crc32(dataBytes);
            const local = [u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(dataBytes.length),u32(dataBytes.length),u16(nameBytes.length),u16(0),nameBytes,dataBytes];
            chunks.push(...local); const localSize = local.reduce((a,b)=>a+b.length,0);
            const cent = [u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(dataBytes.length),u32(dataBytes.length),u16(nameBytes.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),nameBytes];
            central.push(...cent); offset += localSize;
        });
        const centralSize = central.reduce((a,b)=>a+b.length,0);
        const totalFiles = Object.keys(files).length;
        const end = [u32(0x06054b50),u16(0),u16(0),u16(totalFiles),u16(totalFiles),u32(centralSize),u32(offset),u16(0)];
        const blob = new Blob([...chunks, ...central, ...end], { type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        const safeName = (data.name_en || data.name_th || 'My').replace(/[^a-zA-Z0-9_\-ก-๙]+/g, '_');
        a.download = `${safeName}_${isResume ? 'Resume' : 'Portfolio'}_themed.docx`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }

};

Exporter.generatePPT = (data) => {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';
    pres.author = 'AI Portfolio Toolkit';
    pres.subject = 'Themed portfolio export';
    pres.title = data.name_en || data.name_th || 'Portfolio';

    const W = 13.333;
    const H = 7.5;
    const S = pres.ShapeType;
    const rect = S.rect;
    const ellipse = S.ellipse;
    const roundRect = S.roundRect || S.rect;
    const lang = data.lang || 'th';
    const isLight = data.colorMode === 'light';
    const pStyle = data.portfolioStyle || 'tech';
    const themeMap = {
        tech: { bg1: '061B4A', bg2: '020617', accent: '2563EB', accent2: '38BDF8', paper: 'F8FAFC', ink: '0F172A', muted: '475569' },
        educ: { bg1: '065F46', bg2: '022C22', accent: '059669', accent2: '34D399', paper: 'ECFDF5', ink: '0F172A', muted: '475569' },
        gov: { bg1: '78350F', bg2: '111827', accent: 'D97706', accent2: 'FBBF24', paper: 'FFFBEB', ink: '111827', muted: '57534E' },
        creative: { bg1: '581C87', bg2: '2E1065', accent: 'C026D3', accent2: 'F0ABFC', paper: 'FDF4FF', ink: '111827', muted: '52525B' },
        minimal: { bg1: '111827', bg2: isLight ? 'F8FAFC' : '000000', accent: isLight ? '334155' : 'F8FAFC', accent2: '94A3B8', paper: 'FFFFFF', ink: '111827', muted: '475569' },
        eco: { bg1: '115E59', bg2: '042F2E', accent: '0D9488', accent2: '2DD4BF', paper: 'F0FDFA', ink: '0F172A', muted: '475569' },
        bold: { bg1: '7F1D1D', bg2: '450A0A', accent: 'E11D48', accent2: 'FB7185', paper: 'FFF1F2', ink: '111827', muted: '57534E' },
        luxury: { bg1: '312E81', bg2: '111827', accent: 'B45309', accent2: 'FBBF24', paper: 'FFFBEB', ink: '111827', muted: '57534E' }
    };
    const t = themeMap[pStyle] || themeMap.tech;
    const clean = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    const pickData = (key) => clean(data[`${key}_${lang}`] || data[`${key}_th`] || data[`${key}_en`] || data[key]);
    const pickItem = (item, key) => clean(item[`${key}_${lang}`] || item[`${key}_th`] || item[`${key}_en`] || item[key]);
    const lines = (v) => String(v || '').split('\n').map(x => x.trim()).filter(Boolean);
    const parts = (v) => String(v || '').split('|').map(x => x.trim()).filter(Boolean);
    const skills = pickData('skills').split(',').map(x => x.trim()).filter(Boolean);
    const nameText = pickData('name') || 'My Portfolio';
    const roleText = pickData('role');
    const bioText = pickData('bio');
    const contactLines = [data.email && `Email: ${data.email}`, data.phone && `Phone: ${data.phone}`, data.linkedin && `LinkedIn: ${data.linkedin}`].filter(Boolean);
    const formatYear = (yStr) => {
        if (!yStr) return '';
        const y = parseInt(yStr, 10);
        if (Number.isNaN(y)) return yStr;
        if (lang === 'th' && y < 2500) return String(y + 543);
        if (lang === 'en' && y >= 2500) return String(y - 543);
        return String(y);
    };
    const dateText = (item) => {
        const start = `${item.startMonth || ''} ${formatYear(item.startYear || item.year)}`.trim();
        const end = item.isCurrent ? (lang === 'th' ? 'ปัจจุบัน' : 'Present') : `${item.endMonth || ''} ${formatYear(item.endYear)}`.trim();
        return end ? `${start} - ${end}` : start;
    };
    const addRect = (slide, x, y, w, h, color, transparency = 0, lineColor = color, lineTransparency = 100, shape = rect) => {
        slide.addShape(shape, { x, y, w, h, fill: { color, transparency }, line: { color: lineColor, transparency: lineTransparency } });
    };
    const addStage = (slide, label = 'PORTFOLIO') => {
        addRect(slide, 0, 0, W, H, t.bg2);
        addRect(slide, 0, 0, W, H, t.bg1, 20);
        addRect(slide, 0, 0, 0.28, H, t.accent);
        addRect(slide, 0.28, 0, 0.06, H, t.accent2);
        addRect(slide, 0.72, 0.72, 3.55, 0.02, 'FFFFFF', 78);
        addRect(slide, 9.98, 0.55, 2.95, 0.02, 'FFFFFF', 80);
        addRect(slide, 1.1, 6.45, 1.75, 0.02, 'FFFFFF', 72);
        slide.addShape(ellipse, { x: 10.6, y: -0.65, w: 2.8, h: 2.8, fill: { color: t.accent2, transparency: 84 }, line: { color: t.accent2, transparency: 35, width: 1 } });
        slide.addShape(ellipse, { x: -0.85, y: 5.35, w: 2.9, h: 2.9, fill: { color: t.accent, transparency: 86 }, line: { color: t.accent, transparency: 38, width: 1 } });
        slide.addShape(ellipse, { x: 11.5, y: 1.95, w: 0.26, h: 0.26, fill: { color: t.bg2, transparency: 100 }, line: { color: 'FFFFFF', transparency: 12, width: 1.2 } });
        slide.addShape(ellipse, { x: 11.95, y: 1.95, w: 0.26, h: 0.26, fill: { color: t.bg2, transparency: 100 }, line: { color: 'FFFFFF', transparency: 12, width: 1.2 } });
        slide.addText(label.toUpperCase(), { x: 12.18, y: 2.7, w: 0.25, h: 2.2, rotate: 270, fontSize: 10, bold: true, color: 'FFFFFF', transparency: 18, margin: 0, breakLine: false });
    };
    const addPaper = (slide, x, y, w, h, opts = {}) => {
        addRect(slide, x, y, w, h, opts.fill || 'FFFFFF', opts.transparency || 0, opts.line || t.accent, opts.lineTransparency ?? 0, roundRect);
        addRect(slide, x + 0.28, y + 0.28, w - 0.56, 0.08, opts.bar || t.accent, 0, opts.bar || t.accent, 100, roundRect);
    };
    const addCard = (slide, x, y, w, h, title, body, opts = {}) => {
        addRect(slide, x, y, w, h, opts.fill || 'FFFFFF', opts.transparency || 0, opts.line || 'D8E1EE', 0, roundRect);
        slide.addText(clean(title), { x: x + 0.22, y: y + 0.2, w: w - 0.44, h: 0.35, fontSize: opts.titleSize || 13, bold: true, color: opts.titleColor || t.ink, margin: 0.02, fit: 'shrink' });
        if (body) slide.addText(clean(body), { x: x + 0.22, y: y + 0.7, w: w - 0.44, h: h - 0.9, fontSize: opts.bodySize || 9.5, color: opts.bodyColor || t.muted, margin: 0.02, breakLine: false, fit: 'shrink', valign: 'top' });
    };
    const addTitle = (slide, title, sub = '') => {
        slide.addText(clean(title), { x: 0.78, y: 0.52, w: 7.0, h: 0.45, fontSize: 19, bold: true, color: 'FFFFFF', margin: 0, fit: 'shrink' });
        if (sub) slide.addText(clean(sub), { x: 0.8, y: 0.95, w: 6.8, h: 0.24, fontSize: 8.5, color: 'CBD5E1', margin: 0, fit: 'shrink' });
        addRect(slide, 0.8, 1.25, 2.6, 0.04, t.accent2);
    };
    const bulletText = (arr, max = 6) => arr.slice(0, max).map(x => `• ${clean(x)}`).join('\n');
    const makeSlide = (label) => { const s = pres.addSlide(); addStage(s, label); return s; };

    let slide = makeSlide('COVER');
    addPaper(slide, 0.9, 0.85, 5.35, 4.25, { fill: '111827', line: t.accent2, bar: t.accent2, transparency: 2 });
    if (data.avatar) {
        slide.addImage({ data: data.avatar, x: 1.35, y: 1.35, w: 1.85, h: 1.85, sizing: { type: 'cover', w: 1.85, h: 1.85 } });
        slide.addImage({ data: data.avatar, x: 3.48, y: 1.35, w: 1.85, h: 1.85, sizing: { type: 'cover', w: 1.85, h: 1.85 } });
    } else {
        addRect(slide, 1.35, 1.35, 4.0, 1.85, 'FFFFFF', 5, 'FFFFFF', 10, roundRect);
        slide.addText(nameText.charAt(0).toUpperCase(), { x: 1.35, y: 1.55, w: 4.0, h: 1.25, align: 'center', fontSize: 50, bold: true, color: t.accent, margin: 0 });
    }
    slide.addText(bioText || roleText || 'Portfolio overview', { x: 1.35, y: 3.65, w: 4.65, h: 0.72, fontSize: 10.5, color: 'E5E7EB', fit: 'shrink', valign: 'mid' });
    slide.addText(nameText, { x: 6.9, y: 4.35, w: 5.6, h: 0.9, fontSize: 34, bold: true, color: 'FFFFFF', margin: 0, fit: 'shrink' });
    slide.addText(roleText || 'PORTFOLIO', { x: 6.92, y: 5.18, w: 5.25, h: 0.38, fontSize: 13, color: t.accent2, bold: true, margin: 0, fit: 'shrink' });
    addRect(slide, 6.92, 5.85, 0.25, 0.25, t.bg2, 100, 'FFFFFF', 10, ellipse);
    addRect(slide, 7.32, 5.85, 0.25, 0.25, t.bg2, 100, 'FFFFFF', 10, ellipse);

    slide = makeSlide('PROFILE');
    addTitle(slide, lang === 'th' ? 'ภาพรวมโปรไฟล์' : 'Profile Overview', roleText);
    addPaper(slide, 0.82, 1.58, 5.85, 4.98, { fill: t.paper, line: t.accent, bar: t.accent });
    addCard(slide, 1.18, 2.12, 5.1, 1.9, lang === 'th' ? 'สรุป' : 'Summary', bioText || '-', { fill: 'FFFFFF', line: 'D8E1EE', bodySize: 10.5 });
    addCard(slide, 1.18, 4.25, 2.45, 1.25, lang === 'th' ? 'ทักษะ' : 'Skills', skills.slice(0, 8).join('  •  ') || '-', { fill: 'FFFFFF', line: t.accent, bodySize: 8.8 });
    addCard(slide, 3.82, 4.25, 2.45, 1.25, lang === 'th' ? 'ติดต่อ' : 'Contact', contactLines.join('\n') || '-', { fill: 'FFFFFF', line: t.accent2, bodySize: 8.5 });
    addPaper(slide, 7.25, 1.58, 4.85, 4.98, { fill: 'FFFFFF', line: t.accent2, bar: t.accent2 });
    const expPreview = (data.exp || []).slice(0, 4).map(e => `${dateText(e)}  ${pickItem(e, 'title')}`).join('\n');
    slide.addText(lang === 'th' ? 'ลำดับงานเด่น' : 'Selected Timeline', { x: 7.65, y: 2.05, w: 3.9, h: 0.35, fontSize: 16, bold: true, color: t.ink, margin: 0 });
    slide.addText(expPreview || '-', { x: 7.65, y: 2.55, w: 3.95, h: 2.2, fontSize: 11, color: t.muted, breakLine: false, fit: 'shrink' });
    slide.addText(String(new Date().getFullYear()), { x: 9.15, y: 4.48, w: 2.4, h: 0.8, fontSize: 44, bold: true, color: t.accent, transparency: 78, margin: 0 });

    (data.exp || []).forEach((e, index) => {
        const title = pickItem(e, 'title');
        const company = pickItem(e, 'company');
        const desc = pickItem(e, 'desc');
        const highlights = e[`highlights_${lang}`] || e.highlights_th || e.highlights_en || e.highlights || [];
        if (!title && !desc && !highlights.length && !(e.images || []).length) return;
        const s = makeSlide(`WORK ${index + 1}`);
        addTitle(s, title || `Project ${index + 1}`, `${dateText(e)}${company ? ' | ' + company : ''}`);
        addPaper(s, 0.82, 1.55, 5.7, 5.05, { fill: 'FFFFFF', line: t.accent, bar: t.accent });
        s.addText(desc || '-', { x: 1.22, y: 2.08, w: 4.9, h: 1.05, fontSize: 11.5, color: t.muted, fit: 'shrink' });
        s.addText(bulletText(highlights, 6) || '-', { x: 1.22, y: 3.35, w: 4.9, h: 2.3, fontSize: 10.5, color: t.ink, fit: 'shrink', breakLine: false });
        const imgs = (e.images || []).slice(0, 3);
        if (imgs.length) {
            imgs.forEach((img, idx) => {
                const x = 7.15 + (idx === 0 ? 0 : 2.12);
                const y = idx === 0 ? 1.55 : 4.28;
                const w = idx === 0 ? 4.45 : 2.0;
                const h = idx === 0 ? 2.45 : 1.7;
                addRect(s, x - 0.05, y - 0.05, w + 0.1, h + 0.1, 'FFFFFF', 0, t.accent2, 0, roundRect);
                s.addImage({ data: img, x, y, w, h, sizing: { type: 'cover', w, h } });
            });
        } else {
            addPaper(s, 7.15, 1.55, 4.6, 5.05, { fill: t.paper, line: t.accent2, bar: t.accent2 });
            s.addText(lang === 'th' ? 'ไม่มีรูปแนบ' : 'No project image', { x: 7.75, y: 3.52, w: 3.3, h: 0.4, fontSize: 18, bold: true, color: t.accent, align: 'center', margin: 0 });
        }
    });

    const extraGroups = [
        { label: lang === 'th' ? 'บริการและกรณีศึกษา' : 'Services & Case Studies', keys: ['services', 'caseStudies', 'articles'] },
        { label: lang === 'th' ? 'ความน่าเชื่อถือ' : 'Trust & Proof', keys: ['education', 'certifications', 'awards', 'clients', 'testimonials'] }
    ];
    extraGroups.forEach((group) => {
        const blocks = group.keys.map(key => ({ key, items: lines(pickData(key)) })).filter(x => x.items.length);
        if (!blocks.length) return;
        const s = makeSlide(group.label);
        addTitle(s, group.label, nameText);
        addPaper(s, 0.82, 1.52, 11.35, 5.15, { fill: t.paper, line: t.accent, bar: t.accent2 });
        blocks.forEach((block, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 1.16 + col * 5.36;
            const y = 2.05 + row * 1.72;
            const text = block.items.slice(0, 3).map(item => parts(item).slice(0, 3).join(' | ')).join('\n');
            addCard(s, x, y, 5.05, 1.38, block.key.replace(/([A-Z])/g, ' $1').toUpperCase(), text, { fill: 'FFFFFF', line: col ? t.accent2 : t.accent, bodySize: 8.2, titleSize: 10.5 });
        });
    });

    const safeName = (data.name_en || data.name_th || 'My').replace(/\s+/g, '_');
    pres.writeFile({ fileName: `${safeName}_Portfolio_themed.pptx` });
};

Exporter.generateDOCX = (data) => {
    const lang = data.lang || 'th';
    const isResume = (data.layout || 'portfolio') === 'resume';
    const pStyle = data.portfolioStyle || 'tech';
    const safeXml = (v) => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const theme = {
        tech: { accent: '2563EB', accent2: '38BDF8', dark: '061B4A', dark2: '020617', side: '1D4ED8', soft: 'EFF6FF', paper: 'FFFFFF', text: '0F172A', muted: '475569' },
        educ: { accent: '059669', accent2: '34D399', dark: '065F46', dark2: '022C22', side: '047857', soft: 'ECFDF5', paper: 'FFFFFF', text: '0F172A', muted: '475569' },
        gov: { accent: 'D97706', accent2: 'FBBF24', dark: '78350F', dark2: '111827', side: 'B45309', soft: 'FFFBEB', paper: 'FFFFFF', text: '111827', muted: '57534E' },
        creative: { accent: 'C026D3', accent2: 'F0ABFC', dark: '581C87', dark2: '2E1065', side: 'A21CAF', soft: 'FDF4FF', paper: 'FFFFFF', text: '111827', muted: '52525B' },
        minimal: { accent: '334155', accent2: '94A3B8', dark: '111827', dark2: '000000', side: '1F2937', soft: 'F8FAFC', paper: 'FFFFFF', text: '111827', muted: '475569' },
        eco: { accent: '0D9488', accent2: '2DD4BF', dark: '115E59', dark2: '042F2E', side: '0F766E', soft: 'F0FDFA', paper: 'FFFFFF', text: '0F172A', muted: '475569' },
        bold: { accent: 'E11D48', accent2: 'FB7185', dark: '7F1D1D', dark2: '450A0A', side: 'BE123C', soft: 'FFF1F2', paper: 'FFFFFF', text: '111827', muted: '57534E' },
        luxury: { accent: 'B45309', accent2: 'FBBF24', dark: '312E81', dark2: '111827', side: '92400E', soft: 'FFFBEB', paper: 'FFFFFF', text: '111827', muted: '57534E' }
    }[pStyle] || { accent: '0D9488', accent2: '2DD4BF', dark: '0F172A', dark2: '020617', side: '0F766E', soft: 'F0FDFA', paper: 'FFFFFF', text: '0F172A', muted: '475569' };
    const clean = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    const lines = (text) => String(text || '').split('\n').map(x => x.trim()).filter(Boolean);
    const pickText = (key) => data[`${key}_${lang}`] || data[`${key}_th`] || data[`${key}_en`] || '';
    const pick = (item, key) => item[`${key}_${lang}`] || item[`${key}_th`] || item[`${key}_en`] || item[key] || '';
    const highlightsOf = (item) => item[`highlights_${lang}`] || item.highlights_th || item.highlights_en || item.highlights || [];
    const formatYear = (yStr) => { if (!yStr) return ''; const y = parseInt(yStr, 10); if (Number.isNaN(y)) return yStr; if (lang === 'th' && y < 2500) return String(y + 543); if (lang === 'en' && y >= 2500) return String(y - 543); return String(y); };
    const dateText = (item) => { const start = `${item.startMonth || ''} ${formatYear(item.startYear || item.year)}`.trim(); const end = item.isCurrent ? (lang === 'th' ? 'ปัจจุบัน' : 'Present') : `${item.endMonth || ''} ${formatYear(item.endYear)}`.trim(); return end ? `${start} - ${end}` : start; };
    const labels = {
        contact: lang === 'th' ? 'ข้อมูลติดต่อ' : 'CONTACT',
        profile: lang === 'th' ? 'ประวัติโดยย่อ' : 'PROFILE',
        skills: lang === 'th' ? 'ทักษะและความเชี่ยวชาญ' : 'SKILLS',
        exp: lang === 'th' ? 'ประสบการณ์และผลงาน' : 'EXPERIENCE & PROJECTS',
        education: lang === 'th' ? 'การศึกษา' : 'EDUCATION',
        certifications: lang === 'th' ? 'ประกาศนียบัตร' : 'CERTIFICATIONS',
        awards: lang === 'th' ? 'รางวัล' : 'AWARDS',
        caseStudies: lang === 'th' ? 'กรณีศึกษา' : 'CASE STUDIES',
        services: lang === 'th' ? 'บริการ' : 'SERVICES',
        testimonials: lang === 'th' ? 'คำรับรอง' : 'TESTIMONIALS',
        clients: lang === 'th' ? 'ลูกค้า / หน่วยงาน' : 'CLIENTS / PARTNERS',
        articles: lang === 'th' ? 'บทความ / ผลงานเผยแพร่' : 'ARTICLES / PUBLICATIONS',
        cta: lang === 'th' ? 'คำเชิญชวน' : 'CALL TO ACTION'
    };
    const name = pickText('name') || data.name_th || data.name_en || 'My Portfolio';
    const role = pickText('role') || data.role_th || data.role_en || '';
    const bio = pickText('bio') || data.bio_th || data.bio_en || '';
    const skills = (pickText('skills') || data.skills_th || data.skills_en || '').split(',').map(s => s.trim()).filter(Boolean);
    const exp = data.exp || [];
    const contactText = [data.email, data.phone, data.linkedin].filter(Boolean).join('  |  ');
    const r = (text, opts = {}) => `<w:r><w:rPr><w:rFonts w:ascii="${opts.font || 'Aptos'}" w:hAnsi="${opts.font || 'Aptos'}" w:eastAsia="${opts.eastFont || 'Aptos'}"/>${opts.bold ? '<w:b/>' : ''}${opts.italic ? '<w:i/>' : ''}<w:color w:val="${opts.color || theme.text}"/><w:sz w:val="${opts.size || 22}"/></w:rPr><w:t xml:space="preserve">${safeXml(text)}</w:t></w:r>`;
    const pPara = (runs, opts = {}) => `<w:p><w:pPr>${opts.align ? `<w:jc w:val="${opts.align}"/>` : ''}${opts.shd ? `<w:shd w:fill="${opts.shd}"/>` : ''}${opts.before || opts.after ? `<w:spacing w:before="${opts.before || 0}" w:after="${opts.after || 100}"/>` : ''}${opts.bdr ? `<w:pBdr><w:bottom w:val="single" w:sz="10" w:space="4" w:color="${opts.bdr}"/></w:pBdr>` : ''}</w:pPr>${Array.isArray(runs) ? runs.join('') : runs}</w:p>`;
    const cell = (content, opts = {}) => `<w:tc><w:tcPr><w:tcW w:w="${opts.w || 5000}" w:type="pct"/><w:shd w:fill="${opts.fill || 'FFFFFF'}"/><w:tcMar><w:top w:w="${opts.pad || 220}" w:type="dxa"/><w:left w:w="${opts.pad || 220}" w:type="dxa"/><w:bottom w:w="${opts.pad || 220}" w:type="dxa"/><w:right w:w="${opts.pad || 220}" w:type="dxa"/></w:tcMar>${opts.border ? `<w:tcBorders><w:top w:val="single" w:sz="8" w:color="${opts.border}"/><w:left w:val="single" w:sz="8" w:color="${opts.border}"/><w:bottom w:val="single" w:sz="8" w:color="${opts.border}"/><w:right w:val="single" w:sz="8" w:color="${opts.border}"/></w:tcBorders>` : ''}</w:tcPr>${content}</w:tc>`;
    const table = (rows, opts = {}) => `<w:tbl><w:tblPr><w:tblW w:w="10000" w:type="pct"/><w:tblBorders><w:top w:val="${opts.border ? 'single' : 'nil'}" w:sz="8" w:color="${opts.border || 'FFFFFF'}"/><w:left w:val="${opts.border ? 'single' : 'nil'}" w:sz="8" w:color="${opts.border || 'FFFFFF'}"/><w:bottom w:val="${opts.border ? 'single' : 'nil'}" w:sz="8" w:color="${opts.border || 'FFFFFF'}"/><w:right w:val="${opts.border ? 'single' : 'nil'}" w:sz="8" w:color="${opts.border || 'FFFFFF'}"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr>${rows.map(row => `<w:tr>${row}</w:tr>`).join('')}</w:tbl>`;
    const heading = (text, color = theme.accent) => pPara(r(text, { bold: true, color, size: 26 }), { before: 240, after: 120, bdr: color });
    const plainLines = (text, color = theme.text) => lines(text).map(x => pPara(r(x, { color }), { after: 80 })).join('');
    const card = (title, text, fill = 'FFFFFF') => {
        const body = lines(text).map(line => pPara(r(clean(line), { color: theme.muted, size: 20 }), { after: 70 })).join('');
        return table([cell(pPara(r(title, { bold: true, color: theme.accent, size: 24 }), { after: 90 }) + body, { fill, border: theme.accent, pad: 260 })], { border: theme.accent });
    };
    let expBody = '';
    if (exp.length) {
        expBody += heading(labels.exp, isResume ? theme.accent : theme.accent2);
        exp.forEach(item => {
            const title = pick(item, 'title');
            if (!title && !pick(item, 'desc') && !highlightsOf(item).length) return;
            const blockText = [
                `${dateText(item)}${pick(item, 'company') ? ' | ' + pick(item, 'company') : ''}`,
                pick(item, 'desc'),
                ...highlightsOf(item).map(h => `• ${h}`)
            ].filter(Boolean).join('\n');
            expBody += card(title || '-', blockText, theme.paper);
        });
    }
    const extraSections = [
        ['services', labels.services, 'card'], ['caseStudies', labels.caseStudies, 'card'], ['education', labels.education, 'plain'],
        ['certifications', labels.certifications, 'plain'], ['awards', labels.awards, 'plain'], ['clients', labels.clients, 'plain'],
        ['testimonials', labels.testimonials, 'plain'], ['articles', labels.articles, 'plain']
    ].map(([key, label, mode]) => {
        const text = pickText(key);
        if (!lines(text).length) return '';
        return mode === 'card' ? heading(label) + card(label, text, theme.soft) : heading(label) + plainLines(text);
    }).join('');
    let body = '';
    if (isResume) {
        const sidebar = [
            pPara(r(name, { bold: true, color: 'FFFFFF', size: 34 }), { after: 80 }),
            role ? pPara(r(role, { color: 'E0F2FE', size: 22, bold: true }), { after: 220 }) : '',
            pPara(r(labels.contact, { bold: true, color: 'FFFFFF', size: 23 }), { before: 180, after: 80, bdr: 'FFFFFF' }),
            contactText ? pPara(r(contactText, { color: 'FFFFFF', size: 19 }), { after: 180 }) : '',
            skills.length ? pPara(r(labels.skills, { bold: true, color: 'FFFFFF', size: 23 }), { before: 180, after: 80, bdr: 'FFFFFF' }) : '',
            ...skills.map(sk => pPara(r(`• ${sk}`, { color: 'FFFFFF', size: 19 }), { after: 50 }))
        ].join('');
        const main = [
            bio ? heading(labels.profile) + pPara(r(bio, { color: theme.muted }), { after: 120 }) : '',
            expBody,
            extraSections
        ].join('');
        body = table([cell(sidebar, { w: 3100, fill: theme.side, pad: 340 }) + cell(main, { w: 6900, fill: 'FFFFFF', pad: 420 })]);
    } else {
        const hero = [
            pPara(r(' ', { color: theme.accent2, size: 4 }), { shd: theme.accent2, after: 220 }),
            pPara(r(name, { bold: true, color: 'FFFFFF', size: 42 }), { align: 'center', shd: theme.dark2, before: 260, after: 120 }),
            role ? pPara(r(role, { bold: true, color: theme.accent2, size: 23 }), { align: 'center', shd: theme.dark2, after: 260 }) : ''
        ].join('');
        const intro = [
            bio ? card(labels.profile, bio, 'FFFFFF') : '',
            skills.length ? card(labels.skills, skills.join('  •  '), theme.soft) : '',
            contactText ? card(labels.contact, contactText, 'FFFFFF') : ''
        ].join('');
        const paper = table([cell(intro + expBody + extraSections, { fill: 'FFFFFF', border: theme.accent, pad: 360 })], { border: theme.accent });
        body = table([cell(hero + paper, { fill: theme.dark2, border: theme.accent, pad: 360 })], { border: theme.accent });
    }
    const pageSz = '<w:pgSz w:w="11906" w:h="16838"/>';
    const pageBackground = `<w:background w:color="${isResume ? 'FFFFFF' : theme.dark2}"/>`;
    const pageBorders = `<w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="22" w:space="18" w:color="${theme.accent}"/><w:left w:val="single" w:sz="22" w:space="18" w:color="${theme.accent}"/><w:bottom w:val="single" w:sz="22" w:space="18" w:color="${theme.accent}"/><w:right w:val="single" w:sz="22" w:space="18" w:color="${theme.accent}"/></w:pgBorders>`;
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${pageBackground}<w:body>${body}<w:sectPr>${pageSz}<w:pgMar w:top="600" w:right="600" w:bottom="600" w:left="600"/>${pageBorders}</w:sectPr></w:body></w:document>`;
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos" w:eastAsia="Aptos"/><w:sz w:val="22"/></w:rPr></w:style></w:styles>`;
    const files = {
        '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`,
        '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
        'word/_rels/document.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
        'word/document.xml': documentXml,
        'word/styles.xml': stylesXml
    };
    const crcTable = (() => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)); t[n] = c >>> 0; } return t; })();
    const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = crcTable[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
    const enc = new TextEncoder();
    const chunks = []; const central = []; let offset = 0;
    const u16 = n => new Uint8Array([n & 255, (n >>> 8) & 255]);
    const u32 = n => new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
    Object.entries(files).forEach(([fileName, content]) => {
        const nameBytes = enc.encode(fileName); const dataBytes = enc.encode(content); const crc = crc32(dataBytes);
        const local = [u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0), nameBytes, dataBytes];
        chunks.push(...local); const localSize = local.reduce((a, b) => a + b.length, 0);
        const cent = [u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes];
        central.push(...cent); offset += localSize;
    });
    const centralSize = central.reduce((a, b) => a + b.length, 0);
    const totalFiles = Object.keys(files).length;
    const end = [u32(0x06054b50), u16(0), u16(0), u16(totalFiles), u16(totalFiles), u32(centralSize), u32(offset), u16(0)];
    const blob = new Blob([...chunks, ...central, ...end], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    const safeName = (data.name_en || data.name_th || 'My').replace(/[^a-zA-Z0-9_\-\u0E00-\u0E7F]+/g, '_');
    a.download = `${safeName}_${isResume ? 'Resume' : 'Portfolio'}_themed.docx`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
};

if (typeof window !== "undefined") window.Exporter = Exporter;
