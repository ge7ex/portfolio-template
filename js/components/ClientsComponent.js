
function _sectionHas(v){return !!(v && String(v).trim());}
function _lines(v){return _sectionHas(v)?String(v).split('\n').map(s=>s.trim()).filter(Boolean):[];}
function _parts(line){return line.split('|').map(s=>s.trim());}
function _theme(layout,colorMode,pStyle){const dark=colorMode==='dark';return{dark,accent:{tech:'blue',educ:'emerald',gov:'amber',creative:'fuchsia',minimal:'slate',eco:'teal',bold:'rose',luxury:'amber'}[pStyle]||'blue'};}
function _title(txt,t){return `<h3 class="section-title section-title-${t.accent}">${txt}</h3>`;}
function _wrap(body, cls=''){return body?`<section class="portfolio-extra-section ${cls}">${body}</section>`:'';}

const ClientsComponent={render:(content,layout,colorMode,pStyle,lang)=>{const items=String(content||'').split(/[\n,]/).map(s=>s.trim()).filter(Boolean);if(!items.length)return'';const t=_theme(layout,colorMode,pStyle);const title=lang==='th'?'ลูกค้า / หน่วยงานที่ร่วมงาน':'Clients / Partners';return _wrap(_title(title,t)+`<div class="client-logo-grid">${items.map(x=>`<span>${x}</span>`).join('')}</div>`,'clients-section')}};
