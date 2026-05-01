
function _sectionHas(v){return !!(v && String(v).trim());}
function _lines(v){return _sectionHas(v)?String(v).split('\n').map(s=>s.trim()).filter(Boolean):[];}
function _parts(line){return line.split('|').map(s=>s.trim());}
function _theme(layout,colorMode,pStyle){const dark=colorMode==='dark';return{dark,accent:{tech:'blue',educ:'emerald',gov:'amber',creative:'fuchsia',minimal:'slate',eco:'teal',bold:'rose',luxury:'amber'}[pStyle]||'blue'};}
function _title(txt,t){return `<h3 class="section-title section-title-${t.accent}">${txt}</h3>`;}
function _wrap(body, cls=''){return body?`<section class="portfolio-extra-section ${cls}">${body}</section>`:'';}

const TestimonialsComponent={render:(content,layout,colorMode,pStyle,lang)=>{const items=_lines(content);if(!items.length)return'';const t=_theme(layout,colorMode,pStyle);const title=lang==='th'?'คำรับรอง':'Testimonials';const body=items.map(l=>{const [quote,name,role]=_parts(l);return `<blockquote class="extra-card testimonial"><p>“${quote||''}”</p>${name?`<footer>${name}${role?` — ${role}`:''}</footer>`:''}</blockquote>`}).join('');return _wrap(_title(title,t)+`<div class="extra-grid">${body}</div>`,'testimonials-section')}};
