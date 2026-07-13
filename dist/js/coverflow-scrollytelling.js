/* Responsive coverflow image rail for portfolio scrollytelling.
   Text cards and print layout remain unchanged. */
(function () {
    'use strict';

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const smoothstep = (value) => {
        const t = clamp(value, 0, 1);
        return t * t * (3 - (2 * t));
    };

    let rafId = 0;

    function isMobileViewport() {
        return (window.visualViewport?.width || window.innerWidth || 0) < 1024;
    }

    function getTimeline(wrapper) {
        const sticky = wrapper.querySelector('.sticky');
        if (!sticky) return null;
        const viewportHeight = window.visualViewport?.height || window.innerHeight || 1;
        const rect = wrapper.getBoundingClientRect();
        const stickyTop = Number.parseFloat(getComputedStyle(sticky).top) || (isMobileViewport() ? 8 : Math.min(96, viewportHeight * 0.12));
        const stickyHeight = Math.max(1, sticky.offsetHeight || sticky.getBoundingClientRect().height || 1);
        const activeDistance = Math.max(1, rect.height - stickyHeight);
        const progress = clamp((stickyTop - rect.top) / activeDistance, 0, 1);
        return { progress };
    }

    function renderTrack(wrapper) {
        const track = wrapper.querySelector('.scrollytelling-track');
        if (!track || !track.classList.contains('coverflow-track')) return;
        const images = Array.from(track.querySelectorAll('.scrolly-full-image'));
        if (images.length < 2) return;

        const timeline = getTimeline(wrapper);
        if (!timeline) return;

        const startMove = 0.12;
        const endMove = 0.76;
        const raw = clamp((timeline.progress - startMove) / (endMove - startMove), 0, 1);
        const activeFloat = smoothstep(raw) * (images.length - 1);
        const nearest = Math.round(activeFloat);
        const mobile = isMobileViewport();

        track.style.setProperty('--coverflow-active', activeFloat.toFixed(4));
        wrapper.dataset.coverflowIndex = String(nearest);

        images.forEach((image, index) => {
            const offset = index - activeFloat;
            const abs = Math.abs(offset);
            const limited = clamp(offset, mobile ? -2.35 : -3.25, mobile ? 2.35 : 3.25);
            const scale = mobile
                ? clamp(1 - (abs * 0.18), 0.52, 1)
                : clamp(1 - (abs * 0.135), 0.58, 1);
            const opacity = mobile
                ? clamp(1 - (abs * 0.34), 0.10, 1)
                : clamp(1 - (abs * 0.27), 0.16, 1);
            const blur = mobile
                ? clamp((abs - 0.55) * 0.9, 0, 2.4)
                : clamp((abs - 0.7) * 0.75, 0, 2.2);
            const brightness = mobile
                ? clamp(1 - (abs * 0.20), 0.42, 1)
                : clamp(1 - (abs * 0.16), 0.48, 1);
            const z = Math.max(1, 100 - Math.round(abs * 18));

            image.style.setProperty('--coverflow-offset', limited.toFixed(4));
            image.style.setProperty('--coverflow-scale', scale.toFixed(4));
            image.style.setProperty('--coverflow-opacity', opacity.toFixed(4));
            image.style.setProperty('--coverflow-blur', `${blur.toFixed(2)}px`);
            image.style.setProperty('--coverflow-brightness', brightness.toFixed(4));
            image.style.zIndex = String(z);
            image.classList.toggle('is-coverflow-active', index === nearest);
            image.setAttribute('aria-hidden', index === nearest ? 'false' : 'true');
        });
    }

    function updateAll() {
        rafId = 0;
        if (window.matchMedia('print').matches) return;
        document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper.coverflow-ready')
            .forEach(renderTrack);
    }

    function requestUpdate() {
        if (!rafId) rafId = requestAnimationFrame(updateAll);
    }

    function enhance() {
        document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.scrollytelling-track');
            if (!track) return;
            const images = track.querySelectorAll('.scrolly-full-image');
            if (images.length < 2) return;

            const mobileScrollHeight = Math.min(340, 145 + ((images.length - 2) * 38));
            wrapper.style.setProperty('--coverflow-scroll-height', `${mobileScrollHeight}svh`);
            wrapper.classList.add('coverflow-ready');
            track.classList.add('coverflow-track');
            wrapper.querySelectorAll('.coverflow-controls').forEach(node => node.remove());
        });
        requestUpdate();
    }

    const observer = new MutationObserver(enhance);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', () => { enhance(); requestUpdate(); }, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(() => { enhance(); requestUpdate(); }, 180), { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', requestUpdate, { passive: true });
        window.visualViewport.addEventListener('scroll', requestUpdate, { passive: true });
    }
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
    if (document.readyState !== 'loading') enhance();
})();