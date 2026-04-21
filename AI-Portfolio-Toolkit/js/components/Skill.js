// js/components/Skill.js
const SkillsComponent = {
    render: (skills, layout, colorMode, pStyle, lang) => {
        if (!skills) return '';
        const skillList = skills.split(',').map(s => s.trim()).filter(s => s);
        const isDark = colorMode === 'dark';
        const titleText = lang === 'th' ? 'ทักษะและความเชี่ยวชาญ' : 'Skills & Expertise';
        let titleClass = ""; let itemClass = "";

        const themeConfig = {
            tech: { title: 'text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]', itemDark: 'border-blue-500/50 text-blue-200 bg-blue-900/40 rounded-xl shadow-[0_0_10px_rgba(59,130,246,0.2)]', itemLight: 'border-blue-400 text-blue-800 bg-blue-100 rounded-xl shadow-md', resumeTitleDark: 'bg-slate-800 text-white border-blue-500', resumeTitleLight: 'bg-blue-50 text-slate-800 border-blue-500', resumeItemDark: 'border-blue-500/50 text-blue-300 bg-slate-800', resumeItemLight: 'border-blue-400 text-blue-700 bg-white' },
            educ: { title: 'text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]', itemDark: 'border-emerald-500/50 text-emerald-200 bg-emerald-900/40 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)]', itemLight: 'border-emerald-400 text-emerald-800 bg-emerald-100 rounded-xl shadow-md', resumeTitleDark: 'bg-emerald-950 text-white border-emerald-500', resumeTitleLight: 'bg-emerald-50 text-slate-800 border-emerald-500', resumeItemDark: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60', resumeItemLight: 'border-emerald-400 text-emerald-700 bg-emerald-50' },
            gov: { title: 'text-amber-500 font-serif drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]', itemDark: 'border-amber-500/50 text-amber-200 bg-amber-900/40 rounded-md shadow-[0_0_10px_rgba(251,191,36,0.2)]', itemLight: 'border-amber-400 text-amber-800 bg-amber-100 rounded-md shadow-md', resumeTitleDark: 'bg-slate-800 text-amber-300 font-serif border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', resumeItemDark: 'border-amber-500/60 text-amber-300 bg-slate-800', resumeItemLight: 'border-amber-400 text-amber-800 bg-amber-50' },
            creative: { title: 'text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]', itemDark: 'border-fuchsia-500/50 text-fuchsia-200 bg-fuchsia-900/40 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.3)]', itemLight: 'border-fuchsia-400 text-fuchsia-800 bg-fuchsia-100 rounded-full shadow-md', resumeTitleDark: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500', resumeTitleLight: 'bg-fuchsia-50 text-slate-800 border-fuchsia-500', resumeItemDark: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/50 rounded-full', resumeItemLight: 'border-fuchsia-400 text-fuchsia-700 bg-fuchsia-50 rounded-full' },
            minimal: { title: isDark ? 'text-white tracking-[0.2em]' : 'text-slate-800 tracking-[0.2em]', itemDark: 'border-zinc-500 text-slate-100 bg-zinc-800/80 rounded-sm shadow-lg', itemLight: 'border-zinc-300 text-slate-800 bg-white rounded-sm shadow-sm', resumeTitleDark: 'bg-zinc-900 text-zinc-100 border-zinc-400', resumeTitleLight: 'bg-zinc-100 text-zinc-900 border-zinc-700', resumeItemDark: 'border-zinc-500 text-zinc-200 bg-zinc-800 rounded-sm', resumeItemLight: 'border-zinc-300 text-zinc-700 bg-white rounded-sm' },
            eco: { title: 'text-teal-500 drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]', itemDark: 'border-teal-500/50 text-teal-200 bg-teal-900/40 rounded-tl-lg rounded-br-lg shadow-[0_0_10px_rgba(20,184,166,0.2)]', itemLight: 'border-teal-400 text-teal-800 bg-teal-100 rounded-tl-lg rounded-br-lg shadow-md', resumeTitleDark: 'bg-teal-950 text-teal-300 border-teal-500', resumeTitleLight: 'bg-teal-50 text-slate-800 border-teal-500', resumeItemDark: 'border-teal-500/50 text-teal-300 bg-teal-950/50', resumeItemLight: 'border-teal-400 text-teal-700 bg-teal-50' },
            bold: { title: 'text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] italic font-black', itemDark: 'border-rose-500/50 text-rose-200 bg-rose-900/40 rounded-xl font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]', itemLight: 'border-rose-400 text-rose-800 bg-rose-100 rounded-xl font-bold shadow-md', resumeTitleDark: 'bg-rose-950 text-rose-300 italic font-black border-rose-500', resumeTitleLight: 'bg-rose-50 text-slate-800 italic font-black border-rose-500', resumeItemDark: 'border-rose-500/50 text-rose-300 bg-rose-950/50 font-bold', resumeItemLight: 'border-rose-400 text-rose-700 bg-rose-50 font-bold' },
            luxury: { title: 'text-amber-400 font-serif drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]', itemDark: 'border-amber-400/50 text-amber-200 bg-indigo-900/60 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.2)]', itemLight: 'border-amber-400 text-indigo-900 bg-amber-100 rounded-sm shadow-md', resumeTitleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', resumeItemDark: 'border-amber-400/50 text-amber-200 bg-indigo-950/60 rounded-sm', resumeItemLight: 'border-amber-400 text-indigo-800 bg-amber-50 rounded-sm' }
        };

        const t = themeConfig[pStyle] || themeConfig['tech'];

        if (layout === 'resume') {
            titleClass = `text-lg font-bold px-2 py-1 mb-4 border-l-4 ${isDark ? t.resumeTitleDark : t.resumeTitleLight} uppercase tracking-wider`;
            itemClass = `border px-3 py-1 text-sm font-medium rounded shadow-sm ${isDark ? t.resumeItemDark : t.resumeItemLight}`;
        } else {
            titleClass = `font-bold mb-4 uppercase tracking-widest text-sm ${t.title}`;
            itemClass = `border px-4 py-2 text-sm backdrop-blur-sm ${isDark ? t.itemDark : t.itemLight}`;
        }
        return `<section class="mb-10 fade-in"><h3 class="${titleClass}">${titleText}</h3><div class="flex flex-wrap gap-3">${skillList.map(s => `<span class="${itemClass}">${s}</span>`).join('')}</div></section>`;
    }
};