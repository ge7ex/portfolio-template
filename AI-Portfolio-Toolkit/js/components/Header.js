// js/components/Header.js
const HeaderComponent = {
    render: (name, role, layout, avatar, colorMode, pStyle, lang) => {
        const isDark = colorMode === 'dark';

        const themeConfig = {
            tech: { border: 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600', radius: 'rounded-full', resumeAccent: 'text-blue-500', resumeBorder: 'border-blue-500' },
            educ: { border: 'border-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-800', radius: 'rounded-[2rem]', resumeAccent: 'text-emerald-500', resumeBorder: 'border-emerald-500' },
            gov: { border: 'border-amber-400 shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]', fontDark: 'font-serif text-amber-300 border-b-4 border-amber-500/50', fontLight: 'font-serif text-slate-800 border-b-4 border-amber-500', radius: 'rounded-2xl', resumeAccent: 'text-amber-600', resumeBorder: 'border-amber-500' },
            creative: { border: 'border-fuchsia-500 shadow-[0_0_35px_-5px_rgba(217,70,239,0.5)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600', radius: 'rounded-[3rem_1rem]', resumeAccent: 'text-fuchsia-500', resumeBorder: 'border-fuchsia-500' },
            minimal: { border: isDark ? 'border-zinc-800 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-zinc-200 shadow-[0_0_30px_rgba(0,0,0,0.05)]', fontDark: 'text-white tracking-widest uppercase font-extralight', fontLight: 'text-slate-900 tracking-widest uppercase font-extralight', radius: 'rounded-none', resumeAccent: isDark ? 'text-zinc-300' : 'text-zinc-700', resumeBorder: isDark ? 'border-zinc-500' : 'border-zinc-800' },
            eco: { border: 'border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.4)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-br from-teal-300 to-green-400', fontLight: 'bg-clip-text text-transparent bg-gradient-to-br from-teal-600 to-green-600', radius: 'rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-lg rounded-bl-lg', resumeAccent: 'text-teal-500', resumeBorder: 'border-teal-500' },
            bold: { border: 'border-rose-500 shadow-[0_0_40px_-5px_rgba(244,63,94,0.5)] border-[5px]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 uppercase italic font-black', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-500 to-orange-600 uppercase italic font-black', radius: 'rounded-xl', resumeAccent: 'text-rose-500', resumeBorder: 'border-rose-500' },
            luxury: { border: 'border-amber-300 border-x-4 border-y-0 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.4)]', fontDark: 'font-serif bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 tracking-wider', fontLight: 'font-serif bg-clip-text text-transparent bg-gradient-to-b from-indigo-900 to-purple-900 tracking-wider', radius: 'rounded-sm', resumeAccent: 'text-amber-500', resumeBorder: 'border-amber-500' }
        };

        const t = themeConfig[pStyle] || themeConfig['tech'];
        const portfolioFont = isDark ? t.fontDark : t.fontLight;

        const imageHtml = avatar
            ? `<img src="${avatar}" alt="Profile" class="w-40 h-40 lg:w-56 lg:h-56 object-cover ${t.radius} border-4 ${t.border} shadow-2xl mx-auto mb-8 transition-all duration-500">`
            : '';

        const resumeImageHtml = avatar
            ? `<img src="${avatar}" alt="Profile" class="w-24 h-24 object-cover rounded-md border-2 ${isDark ? 'border-slate-700' : t.resumeBorder}">`
            : '';

        const nameText = name || (lang === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name');
        const roleText = role || (lang === 'th' ? 'ตำแหน่งงาน' : 'Professional Position');

        if (layout === 'resume') {
            return `
                <header class="border-b-4 ${t.resumeBorder} pb-6 mb-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-colors">
                    ${resumeImageHtml}
                    <div>
                        <h1 class="text-4xl md:text-5xl font-serif font-bold uppercase tracking-widest ${isDark ? 'text-slate-100' : 'text-slate-900'}">${nameText}</h1>
                        <p class="text-xl md:text-2xl font-semibold mt-2 uppercase tracking-[0.1em] ${t.resumeAccent}">${roleText}</p>
                    </div>
                </header>
            `;
        }

        return `
            <header class="text-center mb-16 fade-in py-10 lg:py-20">
                ${imageHtml}
                <h1 class="text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tight ${portfolioFont}">
                    ${nameText}
                </h1>
                <p class="text-2xl md:text-3xl lg:text-4xl ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-6 font-light tracking-widest uppercase">
                    ${roleText}
                </p>
            </header>
        `;
    }
};