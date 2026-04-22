// js/components/Contact.js
const ContactComponent = {
    render: (email, phone, linkedin, layout, colorMode, pStyle, lang) => {
        if (!email && !phone) return '';
        const isDark = colorMode === 'dark';
        const titleText = lang === 'th' ? 'ข้อมูลติดต่อ' : 'Contact Info';
        let titleClass = ""; let containerClass = ""; let linkClass = "";

        const themeConfig = {
            tech: { title: 'text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]', link: 'text-blue-500 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all', resumeTitleDark: 'bg-slate-800 text-white border-blue-500', resumeTitleLight: 'bg-blue-50 text-slate-800 border-blue-500', resumeLink: 'text-blue-500 hover:underline' },
            educ: { title: 'text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]', link: 'text-emerald-500 hover:text-emerald-400 hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all', resumeTitleDark: 'bg-emerald-950 text-white border-emerald-500', resumeTitleLight: 'bg-emerald-50 text-slate-800 border-emerald-500', resumeLink: 'text-emerald-500 hover:underline' },
            gov: { title: 'text-amber-500 font-serif drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]', link: 'text-amber-500 hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all', resumeTitleDark: 'bg-slate-800 text-amber-400 font-serif border-amber-500', resumeTitleLight: 'bg-slate-100 text-slate-800 font-serif border-amber-500', resumeLink: 'text-amber-600 hover:underline' },
            creative: { title: 'text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]', link: 'text-fuchsia-500 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all', resumeTitleDark: 'bg-fuchsia-950 text-white border-fuchsia-500', resumeTitleLight: 'bg-fuchsia-50 text-slate-800 border-fuchsia-500', resumeLink: 'text-fuchsia-500 hover:underline' },
            minimal: { title: isDark ? 'text-white' : 'text-slate-800', link: isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-600 hover:text-slate-900 underline', resumeTitleDark: 'bg-zinc-800 text-white border-zinc-500', resumeTitleLight: 'bg-zinc-100 text-slate-800 border-zinc-500', resumeLink: isDark ? 'text-zinc-300 hover:underline' : 'text-slate-700 hover:underline' },
            eco: { title: 'text-teal-500 drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]', link: 'text-teal-500 hover:text-teal-400 hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] transition-all', resumeTitleDark: 'bg-teal-950 text-white border-teal-500', resumeTitleLight: 'bg-teal-50 text-slate-800 border-teal-500', resumeLink: 'text-teal-600 hover:underline' },
            bold: { title: 'text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] font-black', link: 'text-rose-500 hover:text-rose-400 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all', resumeTitleDark: 'bg-rose-950 text-white border-rose-500', resumeTitleLight: 'bg-rose-50 text-slate-800 border-rose-500', resumeLink: 'text-rose-600 hover:underline' },
            luxury: { title: 'text-amber-400 font-serif drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]', link: 'text-amber-500 hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all', resumeTitleDark: 'bg-indigo-950 text-amber-300 font-serif border-amber-500', resumeTitleLight: 'bg-amber-50 text-slate-800 font-serif border-amber-500', resumeLink: 'text-amber-600 hover:underline' }
        };

        const t = themeConfig[pStyle] || themeConfig['tech'];

        if (layout === 'resume') {
            titleClass = `text-lg font-bold px-2 py-1 mb-4 border-l-4 ${isDark ? t.resumeTitleDark : t.resumeTitleLight} uppercase tracking-wider`;
            containerClass = `space-y-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`;
            linkClass = t.resumeLink;
        } else {
            titleClass = `font-bold mb-4 uppercase tracking-widest text-sm ${t.title}`;
            linkClass = `${t.link} hover:underline`;
            containerClass = `space-y-4 ${isDark ? 'text-slate-300' : 'text-slate-600'} font-light`;
        }
        return `<section class="fade-in"><h3 class="${titleClass}">${titleText}</h3><ul class="${containerClass}">${email ? `<li class="flex items-center gap-3"><i data-lucide="mail" class="w-4 h-4"></i> <span class="break-all">${email}</span></li>` : ''}${phone ? `<li class="flex items-center gap-3"><i data-lucide="phone" class="w-4 h-4"></i> <span>${phone}</span></li>` : ''}${linkedin ? `<li class="flex items-center gap-3"><i data-lucide="linkedin" class="w-4 h-4"></i> <span class="${linkClass}">${linkedin}</span></li>` : ''}</ul></section>`;
    }
};