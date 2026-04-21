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
            bold: { titleDark: 'bg-rose-950 text-rose-300 italic font-black border-rose-500', titleLight: 'bg-rose-50 text-slate-800 italic font-black border-rose-500', dot: isDark ? 'bg-rose-500' : 'bg-rose-600', dateCls: isDark ? 'text-rose-400' : 'text-rose-600', companyCls: isDark ? 'text-rose-300' : 'text-rose-700', borderLine: isDark ? 'border-rose-500/40' : 'border-rose-400' },
            luxury: { titleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', titleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', dot: isDark ? 'bg-amber-400' : 'bg-amber-600', dateCls: isDark ? 'text-amber-300' : 'text-amber-600', companyCls: isDark ? 'text-amber-200' : 'text-indigo-700', borderLine: isDark ? 'border-amber-500/40' : 'border-amber-400' }
        };
        const rt = resumeTheme[pStyle] || resumeTheme['tech'];

        let titleClass = layout === 'resume'
            ? `text-lg font-bold px-2 py-1 mb-6 border-l-4 ${isDark ? rt.titleDark : rt.titleLight} uppercase tracking-wider`
            : `font-bold mb-8 uppercase tracking-widest text-xl flex items-center ${pStyle === 'educ' ? 'text-emerald-500' : pStyle === 'gov' ? 'text-amber-500 font-serif' : 'text-blue-500'}`;

        const themeConfig = {
            tech: { border: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]', glow: 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]', year: 'text-blue-400 drop-shadow-sm', company: isDark ? 'text-blue-300' : 'text-blue-700', cardDark: 'bg-slate-900/80 border-blue-500/30', cardLight: 'bg-white border-blue-300 shadow-xl' },
            educ: { border: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]', glow: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]', year: 'text-emerald-400 drop-shadow-sm', company: isDark ? 'text-emerald-300' : 'text-emerald-700', cardDark: 'bg-emerald-950/40 border-emerald-500/40', cardLight: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300 shadow-xl' },
            gov: { border: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]', glow: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]', year: 'text-amber-400 drop-shadow-sm', company: isDark ? 'text-amber-300' : 'text-amber-700', cardDark: 'bg-slate-800/90 border-amber-500/40 rounded-xl', cardLight: 'bg-white border-amber-400/50 shadow-xl rounded-xl' },
            creative: { border: 'border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]', glow: 'bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.8)]', year: 'text-fuchsia-400 drop-shadow-sm', company: isDark ? 'text-fuchsia-300' : 'text-fuchsia-700', cardDark: 'bg-fuchsia-950/30 border-fuchsia-400/40 rounded-[3rem]', cardLight: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-300 rounded-[3rem] shadow-xl' },
            minimal: { border: isDark ? 'border-zinc-500/40' : 'border-zinc-300', glow: isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]', year: isDark ? 'text-zinc-300' : 'text-zinc-600', company: isDark ? 'text-white' : 'text-black', cardDark: 'bg-black border-zinc-700 rounded-none shadow-2xl', cardLight: 'bg-white border-zinc-300 rounded-none shadow-xl' },
            eco: { border: 'border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]', glow: 'bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]', year: 'text-teal-400 drop-shadow-sm', company: isDark ? 'text-teal-300' : 'text-teal-700', cardDark: 'bg-teal-950/30 border-teal-500/40 rounded-tl-3xl rounded-br-3xl', cardLight: 'bg-gradient-to-br from-teal-50 to-green-50 border-teal-300 rounded-tl-3xl rounded-br-3xl shadow-xl' },
            bold: { border: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.4)]', glow: 'bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.9)]', year: 'text-rose-400 drop-shadow-sm', company: isDark ? 'text-rose-300' : 'text-rose-700', cardDark: 'bg-rose-950/50 border-rose-500/50', cardLight: 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-400 shadow-2xl' },
            luxury: { border: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]', glow: 'bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)]', year: 'text-amber-300 drop-shadow-sm', company: isDark ? 'text-amber-200' : 'text-indigo-800', cardDark: 'bg-indigo-950/60 border-amber-400/40 rounded-sm shadow-2xl', cardLight: 'bg-gradient-to-br from-indigo-50 to-amber-50/30 border-amber-400/60 rounded-sm shadow-xl' }
        };

        const rows = items.map((item) => {
            const sm = item.startMonth ? item.startMonth + ' ' : '';
            const sy = item.startYear || item.year || '';
            const startDate = `${sm}${sy}`.trim();
            let endDate = item.isCurrent ? presentText : (item.endYear ? `${item.endMonth ? item.endMonth + ' ' : ''}${item.endYear}`.trim() : '');
            const dateDisplay = endDate ? `${startDate} - ${endDate}` : startDate;
            const hasImages = item.images && item.images.length > 0 && layout === 'portfolio';
            const bgAttr = hasImages ? `data-bg="${item.images[0]}"` : '';

            let highlightsHtml = '';
            if (item.highlights && item.highlights.length > 0) {
                const textColor = isDark ? 'text-slate-300' : 'text-slate-700';
                const liItems = item.highlights.map(h => `<li class="pl-1 leading-relaxed"><span class="ml-1">${h}</span></li>`).join('');
                highlightsHtml = `<ul class="mt-4 space-y-2 list-disc pl-5 ${textColor} text-sm md:text-base">${liItems}</ul>`;
            }

            if (layout === 'resume') {
                return `
                <div class="mb-12 relative pl-10 border-l-2 ${rt.borderLine} resume-card py-3 pr-4 print-exp-item">
                    <div class="glow-point absolute w-4 h-4 ${rt.dot} rounded-full -left-[9px] top-4 shadow-lg ring-4 ${isDark ? 'ring-[#0f172a]' : 'ring-white'}"></div>
                    <span class="text-sm font-mono font-medium ${rt.dateCls}">${dateDisplay}</span>
                    <h4 class="mt-1 font-bold font-serif ${isDark ? 'text-slate-100' : 'text-slate-900'}">${item.title}</h4>
                    ${item.company ? `<h5 class="text-md font-semibold ${rt.companyCls} mt-1">${item.company}</h5>` : ''}
                    ${item.desc ? `<p class="${isDark ? 'text-slate-300' : 'text-slate-600'} mt-3 leading-relaxed">${item.desc}</p>` : ''}
                    ${highlightsHtml}
                </div>`;
            }
            else {
                const t = themeConfig[pStyle] || themeConfig['tech'];
                let borderCls = t.border; let glowCls = t.glow;
                let yearCls = `font-mono font-extrabold tracking-widest text-base md:text-lg mb-2 ${t.year}`;
                let cardCls = `unified-card w-full max-w-5xl mx-auto rounded-[2rem] border backdrop-blur-xl shadow-2xl overflow-hidden ${isDark ? t.cardDark : t.cardLight}`;
                let innerDividerCls = `border-t ${isDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-slate-50/50'}`;
                const companyColor = t.company;

                if (hasImages) {
                    const scrollyHeight = (item.images.length * 85) + 250;
                    return `
                    <div ${bgAttr} class="scrollytelling-wrapper relative mb-32 scroll-reveal print-exp-item" style="height: ${scrollyHeight}vh;">
                        <div class="sticky top-[10vh] w-full z-10 px-4 md:px-0">
                            <div class="${cardCls}">
                                <div class="p-8 md:p-12 text-center flex flex-col items-center">
                                    <span class="${yearCls}">${dateDisplay}</span>
                                    <h4 class="font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-4xl md:text-5xl leading-tight">${item.title}</h4>
                                    ${item.company ? `<h5 class="text-xl md:text-2xl font-semibold mt-3 ${companyColor}">${item.company}</h5>` : ''}
                                    ${item.desc ? `<p class="${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg mt-4 leading-relaxed max-w-3xl">${item.desc}</p>` : ''}
                                    ${highlightsHtml ? `<div class="mt-4 text-left inline-block">${highlightsHtml}</div>` : ''}
                                </div>
                                <div class="cinematic-image-wrapper cinematic-collapsed w-full">
                                    <div class="cinematic-image-inner w-full ${innerDividerCls}">
                                        <div class="scrollytelling-track flex gap-6 items-center will-change-transform py-10 px-4">
                                            <div class="scrolly-spacer shrink-0 flex-none w-[5vw] lg:w-[10vw]"></div>
                                            ${item.images.map(imgSrc => `
                                                <img src="${imgSrc}" class="h-[30vh] lg:h-[45vh] w-auto max-w-[85vw] lg:max-w-[60vw] object-cover rounded-2xl shadow-xl border ${isDark ? 'border-white/10' : 'border-slate-300'} shrink-0">
                                            `).join('')}
                                            <div class="scrolly-spacer shrink-0 flex-none w-[80vw] lg:w-[85vw]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                else {
                    return `
                    <div class="mb-24 px-4 md:px-0 scroll-reveal story-section flex flex-col items-center print-exp-item">
                        <div class="${cardCls}">
                            <div class="p-8 md:p-12 text-center flex flex-col items-center">
                                <span class="${yearCls}">${dateDisplay}</span>
                                <h4 class="font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-4xl md:text-5xl leading-tight">${item.title}</h4>
                                ${item.company ? `<h5 class="text-xl md:text-2xl font-semibold mt-3 ${companyColor}">${item.company}</h5>` : ''}
                                ${item.desc ? `<p class="${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg mt-4 leading-relaxed max-w-3xl">${item.desc}</p>` : ''}
                                ${highlightsHtml ? `<div class="mt-4 text-left inline-block">${highlightsHtml}</div>` : ''}
                            </div>
                        </div>
                    </div>`;
                }
            }
        }).join('');

        let titleWrapperCls = layout === 'portfolio' ? "w-full max-w-5xl mx-auto px-4 md:px-0" : "w-full";
        // ดึงสีหัวข้อใหญ่ให้เข้ากับธีมด้วย
        const tTheme = themeConfig[pStyle] || themeConfig['tech'];
        if (layout === 'portfolio') titleClass = `font-bold mb-8 uppercase tracking-widest text-xl flex items-center ${tTheme.title || tTheme.year}`;

        return `
            <section class="fade-in">
                <div class="${titleWrapperCls}">
                    <h3 class="${titleClass} justify-start">
                        ${layout === 'portfolio' ? '<span class="mr-2 opacity-80">🚀</span>' : ''} ${mainTitleText}
                    </h3>
                </div>
                <div class="mt-6 md:mt-10">${rows}</div>
            </section>
        `;
    }
};