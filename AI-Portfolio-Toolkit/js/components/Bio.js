// js/components/Bio.js
const BioComponent = {
    render: (content, layout, colorMode, pStyle, lang) => {
        const isDark = colorMode === 'dark';
        const titleText = lang === 'th' ? 'ประวัติโดยย่อ' : 'Professional Summary';
        let titleClass = "";
        let textClass = "";

        const themeConfig = {
            tech: { portfolioTitle: 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]', bgDark: 'bg-white/5 border-blue-500/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]', bgLight: 'bg-gradient-to-br from-blue-50 to-white border-blue-200', resumeAccent: 'border-blue-500', resumeTitleDark: 'bg-slate-800 text-white border-blue-500', resumeTitleLight: 'bg-blue-50 text-slate-800 border-blue-500' },
            educ: { portfolioTitle: 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]', bgDark: 'bg-emerald-950/40 border-emerald-500/20 shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]', bgLight: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200', resumeAccent: 'border-emerald-500', resumeTitleDark: 'bg-emerald-950 text-white border-emerald-500', resumeTitleLight: 'bg-emerald-50 text-slate-800 border-emerald-500' },
            gov: { portfolioTitle: 'text-amber-400 font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]', bgDark: 'bg-slate-800/80 border-amber-500/20 shadow-[inset_0_0_30px_rgba(251,191,36,0.1)]', bgLight: 'bg-gradient-to-br from-slate-100 to-white border-amber-200', resumeAccent: 'border-amber-500', resumeTitleDark: 'bg-slate-800 text-amber-300 border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 border-amber-500' },
            creative: { portfolioTitle: 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]', bgDark: 'bg-fuchsia-950/30 border-fuchsia-500/30 shadow-[inset_0_0_40px_rgba(217,70,239,0.15)]', bgLight: 'bg-gradient-to-br from-fuchsia-50 via-white to-pink-50 border-fuchsia-200', resumeAccent: 'border-fuchsia-500', resumeTitleDark: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500', resumeTitleLight: 'bg-fuchsia-50 text-slate-800 border-fuchsia-500' },
            minimal: { portfolioTitle: isDark ? 'text-white tracking-[0.2em]' : 'text-slate-800 tracking-[0.2em]', bgDark: 'bg-transparent border-white/10 shadow-2xl', bgLight: 'bg-transparent border-slate-200 shadow-xl', resumeAccent: isDark ? 'border-zinc-400' : 'border-zinc-800', resumeTitleDark: 'bg-zinc-900 text-zinc-100 border-zinc-400', resumeTitleLight: 'bg-zinc-100 text-zinc-900 border-zinc-800' },
            eco: { portfolioTitle: 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]', bgDark: 'bg-teal-950/30 border-teal-500/20 shadow-[inset_0_0_30px_rgba(20,184,166,0.1)]', bgLight: 'bg-gradient-to-br from-teal-50 to-white border-teal-200', resumeAccent: 'border-teal-500', resumeTitleDark: 'bg-teal-950 text-teal-300 border-teal-500', resumeTitleLight: 'bg-teal-50 text-slate-800 border-teal-500' },
            bold: { portfolioTitle: 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)] font-black italic', bgDark: 'bg-rose-950/40 border-rose-500/30 shadow-[inset_0_0_40px_rgba(244,63,94,0.15)]', bgLight: 'bg-gradient-to-br from-rose-50 to-white border-rose-300', resumeAccent: 'border-rose-500', resumeTitleDark: 'bg-rose-950 text-rose-300 font-black italic border-rose-500', resumeTitleLight: 'bg-rose-50 text-slate-800 font-black border-rose-500' },
            luxury: { portfolioTitle: 'text-amber-300 font-serif drop-shadow-[0_0_8px_rgba(252,211,77,0.5)] tracking-widest', bgDark: 'bg-indigo-950/40 border-amber-500/30 shadow-[inset_0_0_30px_rgba(251,191,36,0.1)]', bgLight: 'bg-gradient-to-br from-amber-50/30 to-white border-amber-300/50 shadow-xl', resumeAccent: 'border-amber-500', resumeTitleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500' }
        };

        if (layout === 'resume') {
            const t = themeConfig[pStyle] || themeConfig['tech'];
            titleClass = `text-lg font-bold px-2 py-1 mb-3 border-l-4 ${isDark ? t.resumeTitleDark : t.resumeTitleLight} uppercase tracking-wider`;
            textClass = `leading-relaxed text-md ${isDark ? 'text-slate-300' : 'text-slate-700'} text-justify`;
        } else {
            const t = themeConfig[pStyle] || themeConfig['tech'];
            titleClass = `font-bold mb-4 uppercase tracking-widest text-sm ${t.portfolioTitle}`;
            textClass = `text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-loose p-8 border backdrop-blur-md rounded-2xl ${isDark ? t.bgDark : t.bgLight}`;
        }

        return `<section class="mb-10 fade-in"><h3 class="${titleClass}">${titleText}</h3><div class="${textClass}">${content || (lang === 'th' ? 'กำลังรอให้คุณเขียนประวัติ...' : 'Waiting for your amazing story...')}</div></section>`;
    }
};