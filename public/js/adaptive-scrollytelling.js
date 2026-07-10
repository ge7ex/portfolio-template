(() => {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function ensureStyle() {
    if (document.getElementById('adaptive-scrollytelling-style')) return;
    const style = document.createElement('style');
    style.id = 'adaptive-scrollytelling-style';
    style.textContent = `body.layout-portfolio .experience-section .scrollytelling-wrapper{height:var(--adaptive-scrolly-height,125vh)!important;min-height:0!important;margin-bottom:clamp(2rem,5vh,3.5rem)!important}body.layout-portfolio .experience-section .scrollytelling-track .scrolly-spacer:last-child{flex:0 0 var(--scrolly-end-spacer,6vw)!important;width:var(--scrolly-end-spacer,6vw)!important}@media(max-width:1023px){body.layout-portfolio .experience-section .scrollytelling-wrapper{height:var(--adaptive-scrolly-height,125vh)!important;min-height:0!important}body.layout-portfolio .experience-section .scrollytelling-track .scrolly-spacer:last-child{flex-basis:var(--scrolly-end-spacer,8vw)!important;width:var(--scrolly-end-spacer,8vw)!important}}@media print{body.layout-portfolio .experience-section .scrollytelling-wrapper{height:auto!important}}`;
    document.head.appendChild(style);
  }
  function detachLegacy(){
    if(window._scrollHandler)window.removeEventListener('scroll',window._scrollHandler);
    if(window._scrollResizeHandler)window.removeEventListener('resize',window._scrollResizeHandler);
    if(window._orientationScrollHandler)window.removeEventListener('orientationchange',window._orientationScrollHandler);
    if(window.visualViewport&&window._vvScrollHandler){window.visualViewport.removeEventListener('resize',window._vvScrollHandler);window.visualViewport.removeEventListener('scroll',window._vvScrollHandler)}
  }
  function initAdaptiveScrollytelling(){
    ensureStyle();detachLegacy();
    if(window._revealObserver?.disconnect)window._revealObserver.disconnect();
    window._revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('show')}),{threshold:.08,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.scroll-reveal').forEach(el=>window._revealObserver.observe(el));
    const wrappers=[...document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper')],progressBar=document.getElementById('scroll-progress'),heroFrame=document.querySelector('.hero-frame');let raf=0;
    function measure(wrapper){
      const track=wrapper.querySelector('.scrollytelling-track'),imageBox=wrapper.querySelector('.cinematic-image-wrapper'),sticky=wrapper.querySelector('.sticky');if(!track||!imageBox||!sticky)return null;
      const collapsed=imageBox.classList.contains('cinematic-collapsed');imageBox.classList.remove('cinematic-collapsed');imageBox.classList.add('cinematic-expanded');
      const vh=window.visualViewport?.height||window.innerHeight||1,parentWidth=Math.max(1,track.parentElement?.clientWidth||0,wrapper.clientWidth||0),maxX=Math.max(0,Math.ceil(track.scrollWidth-parentWidth)),stickyH=Math.max(1,sticky.offsetHeight||sticky.getBoundingClientRect().height||1),lead=clamp(vh*.07,42,78),trail=clamp(vh*.085,58,96),move=Math.max(maxX*.82,vh*.18),total=Math.ceil(stickyH+lead+move+trail);
      wrapper.style.setProperty('--adaptive-scrolly-height',`${total}px`);wrapper.dataset.maxX=String(maxX);wrapper.dataset.lead=String(lead);wrapper.dataset.move=String(move);wrapper.dataset.trail=String(trail);
      if(collapsed){imageBox.classList.add('cinematic-collapsed');imageBox.classList.remove('cinematic-expanded')}
      return{track,imageBox,sticky,maxX,lead,move,trail};
    }
    function metrics(wrapper){
      const track=wrapper.querySelector('.scrollytelling-track'),imageBox=wrapper.querySelector('.cinematic-image-wrapper'),sticky=wrapper.querySelector('.sticky'),maxX=Number(wrapper.dataset.maxX),lead=Number(wrapper.dataset.lead),move=Number(wrapper.dataset.move),trail=Number(wrapper.dataset.trail);
      return track&&imageBox&&sticky&&[maxX,lead,move,trail].every(Number.isFinite)?{track,imageBox,sticky,maxX,lead,move,trail}:measure(wrapper);
    }
    function update(){
      raf=0;const vh=window.visualViewport?.height||window.innerHeight||1,maxPage=Math.max(1,document.documentElement.scrollHeight-vh),pageP=clamp(window.scrollY/maxPage,0,1);if(progressBar)progressBar.style.width=`${pageP*100}%`;if(heroFrame){heroFrame.style.setProperty('--profile-scroll-angle',`${Math.round(pageP*720)}deg`);heroFrame.style.setProperty('--profile-scroll-glow',`${.45+pageP*.45}`)}
      wrappers.forEach(wrapper=>{const m=metrics(wrapper);if(!m)return;const rect=wrapper.getBoundingClientRect(),stickyTop=parseFloat(getComputedStyle(m.sticky).top)||Math.min(64,vh*.06),travelled=stickyTop-rect.top,p=clamp((travelled-m.lead)/m.move,0,1);m.track.style.setProperty('--scrolly-x',`-${m.maxX*p}px`);const finish=m.lead+m.move,collapseAt=finish+Math.min(m.trail*.42,46),visible=rect.bottom>stickyTop&&rect.top<vh,active=visible&&travelled>8&&travelled<collapseAt;m.imageBox.classList.toggle('cinematic-expanded',active);m.imageBox.classList.toggle('cinematic-collapsed',!active);wrapper.classList.toggle('scrolly-terminal-collapsed',travelled>=collapseAt)});
    }
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)},remeasure=()=>{wrappers.forEach(wrapper=>{delete wrapper.dataset.maxX;measure(wrapper)});schedule()};
    window._scrollHandler=schedule;window._scrollResizeHandler=()=>{remeasure();setTimeout(remeasure,120)};window._orientationScrollHandler=()=>setTimeout(remeasure,220);window._vvScrollHandler=window._scrollResizeHandler;
    window.addEventListener('scroll',window._scrollHandler,{passive:true});window.addEventListener('resize',window._scrollResizeHandler,{passive:true});window.addEventListener('orientationchange',window._orientationScrollHandler,{passive:true});if(window.visualViewport){window.visualViewport.addEventListener('resize',window._vvScrollHandler,{passive:true});window.visualViewport.addEventListener('scroll',window._vvScrollHandler,{passive:true})}
    wrappers.forEach(wrapper=>{wrapper.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',remeasure,{once:true})});measure(wrapper)});schedule();
  }
  window.installAdaptiveScrollytelling=initAdaptiveScrollytelling;window.initScrollEffects=initAdaptiveScrollytelling;
  const install=()=>{window.initScrollEffects=initAdaptiveScrollytelling;initAdaptiveScrollytelling()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120),{once:true});else setTimeout(install,120);
  window.addEventListener('load',()=>{setTimeout(install,180);setTimeout(install,500)},{once:true});
})();
