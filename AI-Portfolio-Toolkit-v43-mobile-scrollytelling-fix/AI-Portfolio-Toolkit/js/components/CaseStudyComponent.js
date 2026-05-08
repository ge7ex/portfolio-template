
function _sectionHas(v){return !!(v && String(v).trim());}
function _lines(v){return _sectionHas(v)?String(v).split('\n').map(s=>s.trim()).filter(Boolean):[];}
function _parts(line){return line.split('|').map(s=>s.trim());}
function _theme(layout,colorMode,pStyle){const dark=colorMode==='dark';return{dark,accent:{tech:'blue',educ:'emerald',gov:'amber',creative:'fuchsia',minimal:'slate',eco:'teal',bold:'rose',luxury:'amber',health:'cyan',esports:'violet'}[pStyle]||'blue'};}
function _title(txt,t){return `<h3 class="section-title section-title-${t.accent}">${txt}</h3>`;}
function _wrap(body, cls=''){return body?`<section class="portfolio-extra-section ${cls}">${body}</section>`:'';}

const CaseStudyComponent={render:(content,layout,colorMode,pStyle,lang)=>{const items=_lines(content);if(!items.length)return'';const t=_theme(layout,colorMode,pStyle);const title=lang==='th'?'กรณีศึกษา / ผลลัพธ์':'Case Studies';const body=items.map(l=>{const [project,problem,action,result]=_parts(l);return `<article class="extra-card case"><h4>${project||''}</h4>${problem?`<p><b>${lang==='th'?'โจทย์':'Problem'}:</b> ${problem}</p>`:''}${action?`<p><b>${lang==='th'?'วิธีทำ':'Action'}:</b> ${action}</p>`:''}${result?`<p><b>${lang==='th'?'ผลลัพธ์':'Result'}:</b> ${result}</p>`:''}</article>`}).join('');return _wrap(_title(title,t)+`<div class="extra-grid">${body}</div>`,'case-section')}};
