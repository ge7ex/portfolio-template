const SectionUtils = Object.freeze({
    has: (value) => !!(value && String(value).trim()),
    lines(value) {
        return this.has(value) ? String(value).split('\n').map(s => s.trim()).filter(Boolean) : [];
    },
    parts: (line) => line.split('|').map(s => s.trim()),
    theme: (colorMode, pStyle) => ({
        dark: colorMode === 'dark',
        accent: ({ tech:'blue', educ:'emerald', gov:'amber', creative:'fuchsia', minimal:'slate', eco:'teal', bold:'rose', luxury:'amber', health:'cyan', esports:'violet' })[pStyle] || 'blue'
    }),
    title: (text, theme) => `<h3 class="section-title section-title-${theme.accent}">${text}</h3>`,
    wrap: (body, className = '') => body ? `<section class="portfolio-extra-section ${className}">${body}</section>` : ''
});

const EducationComponent={render:(content,layout,colorMode,pStyle,lang)=>{const items=SectionUtils.lines(content);if(!items.length)return'';const t=SectionUtils.theme(colorMode,pStyle);const title=lang==='th'?'การศึกษา':'Education';const body=items.map(l=>{const [degree,school,year,desc]=SectionUtils.parts(l);return `<div class="extra-card"><div class="extra-meta">${year||''}</div><h4>${degree||''}</h4>${school?`<p class="extra-sub">${school}</p>`:''}${desc?`<p>${desc}</p>`:''}</div>`}).join('');return SectionUtils.wrap(SectionUtils.title(title,t)+`<div class="extra-grid">${body}</div>`,'education-section')}};
