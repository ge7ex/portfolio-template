// js/components/Experience.js
const ExperienceComponent = {
    render: (items, layout, colorMode, pStyle, lang) => {
        if (!items || items.length === 0) return '';
        const isDark = colorMode === 'dark';

        const mainTitleText = lang === 'th' ? 'ประสบการณ์และผลงาน' : 'Experience & Projects';
        const presentText = lang === 'th' ? 'ปัจจุบัน' : 'Present';

        const resumeTheme = {
            tech: { titleDark: 'bg-slate-800 text-white border-blue-500', titleLight: 'bg-blue-50 text-slate-800 border-blue-500', dot: isDark ? 'bg-blue-500' : 'bg-blue-600', dateCls: isDark ? 'text-blue-400' : 'text-blue-600', companyCls: isDark ? 'text-blue-300' : 'text-blue-700', borderLine: isDark ? 'border-blue-500/40' : 'border-blue-400' },
            educ: { titleDark: 'bg-emerald-950 text-white border-emerald-500', titleLight: 'bg-emerald-50 text-slate-800 border-emerald-500', dot: isDark ? 'bg-emerald-500' : 'bg-emerald-600', dateCls: isDark ? 'text-emerald-400' : 'text-emerald-600', companyCls: isDark ? 'text-emerald-300' : 'text-emerald-700', borderLine: isDark ? 'border-emerald-500/40' : 'border-emerald-400' },
            gov: { titleDark: 'bg-slate-800 text-amber-300 font-serif border-amber-500', titleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', dot: isDark ? 'bg-amber-400' : 'bg-amber-600', dateCls: isDark ? 'text-amber-400' : 'text-amber-600', companyCls: isDark ? 'text-amber-300' : 'text-amber-700', borderLine: isDark ? 'border-amber-500/40' : 'border-amber-400' },
            creative: { titleDark: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500', titleLight: 'bg-fuchsia-50 text-slate-800 border-fuchsia-500', dot: isDark ? 'bg-fuchsia-500' : 'bg-fuchsia-600', dateCls: isDark ? 'text-fuchsia-400' : 'text-fuchsia-600', companyCls: isDark ? 'text-fuchsia-300' : 'text-fuchsia-700', borderLine: isDark ? 'border-fuchsia-500/40' : 'border-fuchsia-400' },
            minimal: { titleDark: 'bg-zinc-900 text-zinc-100 border-zinc-400', titleLight: 'bg-zinc-100 text-zinc-900 border-zinc-700', dot: isDark ? 'bg-zinc-300' : 'bg-zinc-700', dateCls: isDark ? 'text-zinc-400' : 'text-zinc-500', companyCls: isDark ? 'text-zinc-200' : 'text-zinc-800', borderLine: isDark ? 'border-zinc-600' : 'border-zinc-400' },
            eco: { titleDark: 'bg-teal-950 text-teal-300 border-teal-500', titleLight: 'bg-teal-50 text-slate-800 border-teal-500', dot: isDark ? 'bg-teal-400' : 'bg-teal-600', dateCls: isDark ? 'text-teal-400' : 'text-teal-600', companyCls: isDark ? 'text-teal-300' : 'text-teal-700', borderLine: isDark ? 'border-teal-500/40' : 'border-teal-400' },
            bold: { titleDark: 'bg-rose-950 text-rose-300 font-black border-rose-500', titleLight: 'bg-rose-50 text-slate-800 font-black border-rose-500', dot: isDark ? 'bg-rose-500' : 'bg-rose-600', dateCls: isDark ? 'text-rose-400' : 'text-rose-600', companyCls: isDark ? 'text-rose-300' : 'text-rose-700', borderLine: isDark ? 'border-rose-500/40' : 'border-rose-400' },
            luxury: { titleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', titleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', dot: isDark ? 'bg-amber-400' : 'bg-amber-600', dateCls: isDark ? 'text-amber-300' : 'text-amber-600', companyCls: isDark ? 'text-amber-200' : 'text-indigo-700', borderLine: isDark ? 'border-amber-500/40' : 'border-amber-400' },
            health: { titleDark: 'bg-cyan-950 text-cyan-100 border-cyan-400', titleLight: 'bg-cyan-50 text-slate-800 border-cyan-400', dot: isDark ? 'bg-cyan-300' : 'bg-cyan-600', dateCls: isDark ? 'text-cyan-300' : 'text-cyan-600', companyCls: isDark ? 'text-cyan-200' : 'text-cyan-700', borderLine: isDark ? 'border-cyan-400/40' : 'border-cyan-400' },
            esports: { titleDark: 'bg-violet-950 text-violet-200 font-black border-violet-400', titleLight: 'bg-violet-50 text-slate-900 font-black border-violet-500', dot: isDark ? 'bg-violet-400' : 'bg-violet-600', dateCls: isDark ? 'text-violet-300' : 'text-violet-600', companyCls: isDark ? 'text-cyan-200' : 'text-violet-700', borderLine: isDark ? 'border-violet-400/40' : 'border-violet-400' }
        };
        const rt = resumeTheme[pStyle] || resumeTheme['tech'];

        let titleClass = layout === 'resume'
            ? `text-lg font-bold px-2 py-1 mb-6 border-l-4 ${isDark ? rt.titleDark : rt.titleLight} uppercase tracking-wider`
            : `font-bold mb-8 uppercase tracking-widest text-xl flex items-center ${pStyle === 'educ' ? 'text-emerald-500' : pStyle === 'eco' ? 'text-teal-500' : pStyle === 'health' ? 'text-cyan-400' : pStyle === 'esports' ? 'text-violet-400 font-black' : pStyle === 'gov' ? 'text-amber-500 font-serif' : 'text-blue-500'}`;

        const themeConfig = {
            tech: { border: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]', glow: 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]', year: 'text-blue-400 drop-shadow-sm', company: isDark ? 'text-blue-300' : 'text-blue-700', cardDark: 'bg-slate-900/90 border-blue-500/40', cardLight: 'bg-white border-blue-300 shadow-xl' },
            educ: { border: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]', glow: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]', year: 'text-emerald-400 drop-shadow-sm', company: isDark ? 'text-emerald-300' : 'text-emerald-700', cardDark: 'bg-emerald-950/80 border-emerald-500/40', cardLight: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300 shadow-xl' },
            gov: { border: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]', glow: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]', year: 'text-amber-400 drop-shadow-sm', company: isDark ? 'text-amber-300' : 'text-amber-700', cardDark: 'bg-slate-800/95 border-amber-500/40 rounded-xl', cardLight: 'bg-white border-amber-400/50 shadow-xl rounded-xl' },
            creative: { border: 'border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]', glow: 'bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]', year: 'text-fuchsia-400 drop-shadow-sm', company: isDark ? 'text-fuchsia-300' : 'text-fuchsia-700', cardDark: 'bg-[#2e1065]/80 border-fuchsia-400/40 rounded-[3rem]', cardLight: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-300 rounded-[3rem] shadow-xl' },
            minimal: { border: isDark ? 'border-zinc-500/40' : 'border-zinc-300', glow: isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]', year: isDark ? 'text-zinc-300' : 'text-zinc-600', company: isDark ? 'text-zinc-300' : 'text-black', cardDark: 'bg-black border-zinc-700 rounded-none shadow-2xl', cardLight: 'bg-white border-zinc-300 rounded-none shadow-xl' },
            eco: { border: 'border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]', glow: 'bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]', year: 'text-teal-400 drop-shadow-sm', company: isDark ? 'text-teal-300' : 'text-teal-700', cardDark: 'bg-[#042f2e]/80 border-teal-500/40 rounded-tl-3xl rounded-br-3xl', cardLight: 'bg-gradient-to-br from-teal-50 to-green-50 border-teal-300 rounded-tl-3xl rounded-br-3xl shadow-xl' },
            bold: { border: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.4)]', glow: 'bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.9)]', year: 'text-rose-400 drop-shadow-sm', company: isDark ? 'text-rose-300' : 'text-rose-700', cardDark: 'bg-[#450a0a]/80 border-rose-500/50', cardLight: 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-400 shadow-2xl' },
            health: { border: 'border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.28)]', glow: 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.75)]', year: 'text-cyan-300 drop-shadow-sm', company: isDark ? 'text-cyan-200' : 'text-cyan-700', cardDark: 'bg-cyan-950/70 border-cyan-400/40 rounded-[2rem]', cardLight: 'bg-gradient-to-br from-cyan-50 to-emerald-50 border-cyan-300 rounded-[2rem] shadow-xl' },
            esports: { border: 'border-violet-400/50 shadow-[0_0_18px_rgba(139,92,246,0.35)]', glow: 'bg-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.85)]', year: 'text-violet-300 drop-shadow-sm', company: isDark ? 'text-cyan-200' : 'text-violet-700', cardDark: 'bg-violet-950/70 border-violet-400/40 rounded-xl', cardLight: 'bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-300 rounded-xl shadow-xl' },
            luxury: { border: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]', glow: 'bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)]', year: 'text-amber-300 drop-shadow-sm', company: isDark ? 'text-amber-200' : 'text-indigo-800', cardDark: 'bg-[#1e1b4b]/80 border-amber-400/40 rounded-sm shadow-2xl', cardLight: 'bg-gradient-to-br from-indigo-50 to-amber-50/30 border-amber-400/60 rounded-sm shadow-xl' }
        };

        // 🌟 ฟังก์ชันแปลงปีอัตโนมัติ: ถ้า lang=th แปลงเป็น พ.ศ. (>=2500) ถ้า lang=en แปลงเป็น ค.ศ. (<2500)
        const formatYear = (yStr, targetLang) => {
            if (!yStr) return '';
            const y = parseInt(yStr);
            if (isNaN(y)) return yStr;
            if (targetLang === 'th' && y < 2500) return (y + 543).toString();
            if (targetLang === 'en' && y >= 2500) return (y - 543).toString();
            return y.toString();
        };

        const rows = items.map((item, itemIndex) => {
            const sm = item.startMonth ? item.startMonth + ' ' : '';

            // ใช้ฟังก์ชัน formatYear เพื่อแปลงปี
            const sy = formatYear(item.startYear || item.year, lang);
            const ey = formatYear(item.endYear, lang);

            const startDate = `${sm}${sy}`.trim();
            let endDate = item.isCurrent ? presentText : (ey ? `${item.endMonth ? item.endMonth + ' ' : ''}${ey}`.trim() : '');
            const dateDisplay = endDate ? `${startDate} - ${endDate}` : startDate;

            const hasImages = item.images && item.images.length > 0 && layout === 'portfolio';
            const bgAttr = hasImages ? `data-bg="${item.images[0]}"` : '';
            const imageCount = item.images ? item.images.length : 0;
            const isFirstPrintExp = layout === 'portfolio' && itemIndex === 0;
            const getPrintFitVars = (count) => {
                // Print-only fit variables: compress the first/current project image grid
                // enough to keep the Experience heading and the first project together.
                if (!count) return '';
                if (count <= 2) return '--print-fit-cols:2;--print-fit-img-h:42mm;--print-fit-gap:3mm;';
                if (count <= 4) return '--print-fit-cols:2;--print-fit-img-h:33mm;--print-fit-gap:2.6mm;';
                if (count <= 6) return '--print-fit-cols:3;--print-fit-img-h:26mm;--print-fit-gap:2.3mm;';
                if (count <= 9) return '--print-fit-cols:3;--print-fit-img-h:20mm;--print-fit-gap:2mm;';
                return '--print-fit-cols:4;--print-fit-img-h:16mm;--print-fit-gap:1.8mm;';
            };
            const firstPrintClass = isFirstPrintExp ? ' print-first-exp print-keep-with-title' : '';
            const firstPrintAttrs = isFirstPrintExp ? ` data-print-first-exp="true" data-print-images="${imageCount}"` : '';
            const printFitVars = isFirstPrintExp ? getPrintFitVars(imageCount) : '';

            let highlightsHtml = '';
            if (item.highlights && item.highlights.length > 0) {
                const textColor = isDark ? 'text-slate-100' : 'text-slate-700';
                const liItems = item.highlights.map(h => `<li class="pl-1 leading-relaxed"><span class="ml-1">${h}</span></li>`).join('');
                highlightsHtml = `<ul class="mt-4 space-y-3 list-disc pl-8 ${textColor} text-lg font-light">${liItems}</ul>`;
            }
            const editProjectButton = layout === 'portfolio'
                ? `<button type="button" class="inline-project-edit no-print" onclick="event.stopPropagation(); if (typeof openExperienceEditor === 'function') openExperienceEditor(${itemIndex});"><span>แก้ข้อมูล / รูปภาพ</span></button>`
                : '';

            if (layout === 'resume') {
                return `
                <div class="mb-12 relative pl-10 border-l-2 ${rt.borderLine} resume-card py-3 pr-4 print-exp-item">
                    <div class="glow-point absolute w-4 h-4 ${rt.dot} rounded-full -left-[9px] top-4 shadow-lg ring-4 ${isDark ? 'ring-slate-900' : 'ring-white'}"></div>
                    <span class="text-sm font-mono font-medium ${rt.dateCls}">${dateDisplay}</span>
                    <h4 class="mt-1 font-bold font-serif ${isDark ? 'text-white' : 'text-slate-900'}">${item.title}</h4>
                    ${item.company ? `<h5 class="text-md font-semibold ${rt.companyCls} mt-1">${item.company}</h5>` : ''}
                    ${item.desc ? `<p class="${isDark ? 'text-slate-200' : 'text-slate-600'} mt-3 leading-relaxed text-lg">${item.desc}</p>` : ''}
                    ${highlightsHtml}
                </div>`;
            }
            else {
                const t = themeConfig[pStyle] || themeConfig['tech'];
                let borderCls = t.border; let glowCls = t.glow;
                let yearCls = `font-mono font-extrabold tracking-widest text-base md:text-lg mb-2 ${t.year}`;
                let cardCls = `unified-card w-full max-w-5xl mx-auto rounded-[2.5rem] border backdrop-blur-xl shadow-2xl overflow-hidden ${isDark ? t.cardDark : t.cardLight}`;
                let innerDividerCls = `border-t ${isDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-slate-50/50'}`;
                const companyColor = t.company;

                if (hasImages) {
                    const scrollyHeight = (item.images.length * 85) + 250;
                    return `
                    <div ${bgAttr}${firstPrintAttrs} class="scrollytelling-wrapper relative mb-32 scroll-reveal print-exp-item${firstPrintClass}" style="height: ${scrollyHeight}vh; ${printFitVars}">
                        <div class="sticky top-[10vh] w-full z-10 px-4 md:px-0">
                            <div class="${cardCls}">
                                <div class="p-10 md:p-14 text-center flex flex-col items-center">
                                    <span class="${yearCls}">${dateDisplay}</span>
                                    <h4 class="font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-4xl md:text-5xl leading-tight mb-4">${item.title}</h4>
                                    ${item.company ? `<h5 class="text-xl md:text-2xl font-semibold ${companyColor} mb-6">${item.company}</h5>` : ''}
                                    ${item.desc ? `<p class="${isDark ? 'text-slate-100' : 'text-slate-600'} text-lg md:text-xl leading-relaxed max-w-3xl font-light">${item.desc}</p>` : ''}
                                    ${highlightsHtml ? `<div class="mt-2 text-left inline-block">${highlightsHtml}</div>` : ''}
                                    ${editProjectButton}
                                </div>
                                <div class="cinematic-image-wrapper cinematic-collapsed w-full">
                                    <div class="cinematic-image-inner w-full ${innerDividerCls}">
                                        <div class="scrollytelling-track flex gap-6 items-center will-change-transform py-10 px-4">
                                            <div class="scrolly-spacer shrink-0 flex-none w-[5vw] lg:w-[10vw]"></div>
                                            ${item.images.map(imgSrc => `
                                                <img src="${imgSrc}" class="h-[30vh] lg:h-[45vh] w-auto max-w-[85vw] lg:max-w-[60vw] object-cover rounded-2xl shadow-xl border ${isDark ? 'border-white/10' : 'border-slate-300'} shrink-0">
                                            `).join('')}
                                            <div class="scrolly-spacer shrink-0 flex-none w-[150vw] lg:w-[200vw]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                else {
                    return `
                    <div${firstPrintAttrs} class="mb-24 px-4 md:px-0 scroll-reveal story-section flex flex-col items-center print-exp-item${firstPrintClass}" style="${printFitVars}">
                        <div class="${cardCls}">
                            <div class="p-10 md:p-14 text-center flex flex-col items-center">
                                <span class="${yearCls}">${dateDisplay}</span>
                                <h4 class="font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-4xl md:text-5xl leading-tight mb-4">${item.title}</h4>
                                ${item.company ? `<h5 class="text-xl md:text-2xl font-semibold ${companyColor} mb-6">${item.company}</h5>` : ''}
                                ${item.desc ? `<p class="${isDark ? 'text-slate-100' : 'text-slate-600'} text-lg md:text-xl leading-relaxed max-w-3xl font-light">${item.desc}</p>` : ''}
                                ${highlightsHtml ? `<div class="mt-2 text-left inline-block">${highlightsHtml}</div>` : ''}
                                ${editProjectButton}
                            </div>
                        </div>
                    </div>`;
                }
            }
        }).join('');

        let titleWrapperCls = layout === 'portfolio' ? "w-full max-w-5xl mx-auto px-4 md:px-0" : "w-full";

        if (layout === 'portfolio') {
            const tTheme = themeConfig[pStyle] || themeConfig['tech'];
            const titleColor = isDark ? 'text-white' : 'text-slate-800';
            titleClass = `font-bold mb-10 uppercase tracking-widest text-2xl flex items-center ${titleColor}`;
        }

        return `
            <section class="fade-in experience-section">
                <div class="${titleWrapperCls} experience-title-wrap">
                    <h3 class="${titleClass} justify-start experience-title">
                        ${layout === 'portfolio' ? '<span class="mr-3 opacity-80">🚀</span>' : ''} ${mainTitleText}
                    </h3>
                </div>
                <div class="mt-6 md:mt-10 experience-rows">${rows}</div>
            </section>
        `;
    }
};