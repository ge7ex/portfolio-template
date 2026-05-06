// js/components/Bio.js
const BioComponent = {
    render: (content, layout, colorMode, pStyle, lang) => {
        if (!content || !String(content).trim()) return '';
        const isDark = colorMode === 'dark';
        const titleText = lang === 'th' ? 'ประวัติโดยย่อ' : 'Professional Summary';
        let titleClass = "";
        let textClass = "";

        const themeConfig = {
            tech: { portfolioTitle: 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]', bgDark: 'bg-slate-900/60 border-blue-500/30 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]', bgLight: 'bg-gradient-to-br from-blue-50 to-white border-blue-200', resumeTitleDark: 'bg-slate-800 text-white border-blue-500', resumeTitleLight: 'bg-blue-50 text-slate-800 border-blue-500' },
            educ: { portfolioTitle: 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]', bgDark: 'bg-emerald-950/60 border-emerald-500/30 shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]', bgLight: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200', resumeTitleDark: 'bg-emerald-950 text-white border-emerald-500', resumeTitleLight: 'bg-emerald-50 text-slate-800 border-emerald-500' },
            gov: { portfolioTitle: 'text-amber-400 font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]', bgDark: 'bg-slate-800/80 border-amber-500/30 shadow-[inset_0_0_30px_rgba(251,191,36,0.1)]', bgLight: 'bg-gradient-to-br from-slate-100 to-white border-amber-200', resumeTitleDark: 'bg-slate-800 text-amber-400 font-serif border-amber-500', resumeTitleLight: 'bg-slate-100 text-slate-800 font-serif border-amber-500' },
            creative: { portfolioTitle: 'text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]', bgDark: 'bg-[#2e1065]/60 border-fuchsia-500/30 shadow-[inset_0_0_30px_rgba(217,70,239,0.1)]', bgLight: 'bg-gradient-to-br from-fuchsia-50 to-white border-fuchsia-200', resumeTitleDark: 'bg-fuchsia-950 text-white border-fuchsia-500', resumeTitleLight: 'bg-fuchsia-50 text-slate-800 border-fuchsia-500' },
            minimal: { portfolioTitle: isDark ? 'text-white' : 'text-slate-800', bgDark: 'bg-black/40 border-zinc-700', bgLight: 'bg-white border-zinc-300', resumeTitleDark: 'bg-zinc-800 text-white border-zinc-500', resumeTitleLight: 'bg-zinc-100 text-slate-800 border-zinc-500' },
            eco: { portfolioTitle: 'text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]', bgDark: 'bg-[#042f2e]/60 border-teal-500/30 shadow-[inset_0_0_30px_rgba(20,184,166,0.1)]', bgLight: 'bg-gradient-to-br from-teal-50 to-white border-teal-200', resumeTitleDark: 'bg-teal-950 text-white border-teal-500', resumeTitleLight: 'bg-teal-50 text-slate-800 border-teal-500' },
            bold: { portfolioTitle: 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)] font-black', bgDark: 'bg-[#450a0a]/60 border-rose-500/30 shadow-[inset_0_0_40px_rgba(244,63,94,0.15)]', bgLight: 'bg-gradient-to-br from-rose-50 to-white border-rose-300', resumeTitleDark: 'bg-rose-950 text-white border-rose-500', resumeTitleLight: 'bg-rose-50 text-slate-800 border-rose-500' },
            health: { title: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]', portfolioTitle: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]', bgDark: 'bg-cyan-950/50 border-cyan-400/30', bgLight: 'bg-gradient-to-br from-cyan-50 to-emerald-50 border-cyan-200', itemDark: 'border-cyan-400/50 text-cyan-100 bg-cyan-950/70 rounded-xl', itemLight: 'border-cyan-400 text-cyan-800 bg-cyan-100 rounded-xl', link: 'text-cyan-500 hover:text-cyan-400 transition-all', resumeTitleDark: 'bg-cyan-950 text-cyan-100 border-cyan-400', resumeTitleLight: 'bg-cyan-50 text-slate-800 border-cyan-400', resumeItemDark: 'border-cyan-400/50 text-cyan-200 bg-cyan-950', resumeItemLight: 'border-cyan-400 text-cyan-700 bg-white', resumeLink: 'text-cyan-600 hover:underline' },
            esports: { title: 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.55)] font-black', portfolioTitle: 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.55)] font-black', bgDark: 'bg-violet-950/55 border-violet-400/30', bgLight: 'bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-200', itemDark: 'border-violet-400/50 text-violet-100 bg-violet-950/70 rounded-xl font-bold', itemLight: 'border-violet-400 text-violet-800 bg-violet-100 rounded-xl font-bold', link: 'text-violet-500 hover:text-cyan-400 transition-all', resumeTitleDark: 'bg-violet-950 text-violet-100 border-violet-400', resumeTitleLight: 'bg-violet-50 text-slate-800 border-violet-400', resumeItemDark: 'border-violet-400/50 text-violet-200 bg-violet-950', resumeItemLight: 'border-violet-400 text-violet-700 bg-white', resumeLink: 'text-violet-600 hover:underline' },
            luxury: { portfolioTitle: 'text-amber-300 font-serif drop-shadow-[0_0_8px_rgba(252,211,77,0.5)] tracking-widest', bgDark: 'bg-[#1e1b4b]/60 border-amber-500/30 shadow-[inset_0_0_30px_rgba(251,191,36,0.1)]', bgLight: 'bg-gradient-to-br from-amber-50/30 to-white border-amber-300/50 shadow-xl', resumeTitleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500' }
        };

        const t = themeConfig[pStyle] || themeConfig['tech'];

        if (layout === 'resume') {
            titleClass = `text-lg font-bold px-2 py-1 mb-3 border-l-4 ${isDark ? t.resumeTitleDark : t.resumeTitleLight} uppercase tracking-wider`;
            textClass = `leading-relaxed text-md ${isDark ? 'text-slate-200' : 'text-slate-700'} text-justify`;
        } else {
            titleClass = `font-bold mb-4 uppercase tracking-widest text-sm ${t.portfolioTitle}`;
            textClass = `text-xl ${isDark ? 'text-slate-100' : 'text-slate-600'} leading-loose p-8 border backdrop-blur-md rounded-2xl ${isDark ? t.bgDark : t.bgLight} font-light`;
        }

        return `<section class="mb-10 fade-in"><h3 class="${titleClass}">${titleText}</h3><div class="${textClass}">${content}</div></section>`;
    }
};