// js/components/Header.js
const HeaderComponent = {
    render: (name, role, layout, avatar, colorMode, pStyle, lang) => {
        if (!name && !role && !avatar) return '';
        const isDark = colorMode === 'dark';

        const themeConfig = {
            tech: { border: 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600', radius: 'rounded-full', resumeAccent: 'text-blue-500', resumeBorder: 'border-blue-500' },
            educ: { border: 'border-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-md', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-800', radius: 'rounded-[2rem]', resumeAccent: 'text-emerald-500', resumeBorder: 'border-emerald-500' },
            gov: { border: 'border-amber-400 shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]', fontDark: 'font-serif text-amber-300 border-b-4 border-amber-500/50', fontLight: 'font-serif text-slate-800 border-b-4 border-amber-500', radius: 'rounded-2xl', resumeAccent: 'text-amber-600', resumeBorder: 'border-amber-500' },
            creative: { border: 'border-fuchsia-500 shadow-[0_0_35px_-5px_rgba(217,70,239,0.5)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600', radius: 'rounded-[3rem_1rem]', resumeAccent: 'text-fuchsia-500', resumeBorder: 'border-fuchsia-500' },
            minimal: { border: isDark ? 'border-zinc-800' : 'border-zinc-200', fontDark: 'text-white tracking-widest uppercase font-light', fontLight: 'text-slate-900 tracking-widest uppercase font-light', radius: 'rounded-none', resumeAccent: 'text-slate-500', resumeBorder: 'border-slate-800' },
            eco: { border: 'border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.4)]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-br from-teal-300 to-green-400', fontLight: 'bg-clip-text text-transparent bg-gradient-to-br from-teal-600 to-green-600', radius: 'rounded-tl-[4rem] rounded-br-[4rem]', resumeAccent: 'text-teal-600', resumeBorder: 'border-teal-500' },
            bold: { border: 'border-rose-500 shadow-[0_0_40px_-5px_rgba(244,63,94,0.5)] border-[5px]', fontDark: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 uppercase font-black', fontLight: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-500 to-orange-600 uppercase font-black', radius: 'rounded-xl', resumeAccent: 'text-rose-600', resumeBorder: 'border-rose-500' },
            luxury: { border: 'border-amber-300 border-x-4 border-y-0 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.4)]', fontDark: 'font-serif bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 tracking-wider', fontLight: 'font-serif bg-clip-text text-transparent bg-gradient-to-b from-indigo-900 to-purple-900 tracking-wider', radius: 'rounded-sm', resumeAccent: 'text-amber-600', resumeBorder: 'border-amber-400' }
        };

        const t = themeConfig[pStyle] || themeConfig['tech'];
        const portfolioFont = isDark ? t.fontDark : t.fontLight;

        const imageHtml = avatar
            ? `<img src="${avatar}" alt="Profile" class="w-40 h-40 lg:w-56 lg:h-56 object-cover ${t.radius} border-4 ${t.border} shadow-2xl mx-auto mb-8 transition-all duration-500">`
            : '';

        const resumeImageHtml = avatar
            ? `<img src="${avatar}" alt="Profile" class="w-24 h-24 object-cover rounded-md border-2 ${isDark ? 'border-slate-700' : t.resumeBorder}">`
            : '';

        const nameText = name || '';
        const roleText = role || '';

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
            <header class="portfolio-hero relative overflow-hidden mb-20 fade-in py-12 lg:py-24 px-4">
                <div class="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
                    <div class="text-center lg:text-left order-2 lg:order-1">
                        <h1 class="hero-title text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight ${portfolioFont}">
                            ${nameText}
                        </h1>
                        <p class="text-xl md:text-2xl lg:text-3xl ${isDark ? 'text-slate-200' : 'text-slate-600'} mt-7 font-light tracking-[0.25em] uppercase">
                            ${roleText}
                        </p>
                    </div>
                    <div class="order-1 lg:order-2 relative flex justify-center">
                        <div class="hero-frame ${t.radius} relative">
                            ${avatar ? `<img src="${avatar}" alt="Profile" class="hero-avatar ${t.radius} object-cover">` : `<div class="hero-avatar ${t.radius} flex items-center justify-center text-6xl font-black ${isDark ? 'bg-slate-900/80 text-slate-600' : 'bg-white text-slate-300'}">${(nameText || 'P').charAt(0)}</div>`}
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
};
