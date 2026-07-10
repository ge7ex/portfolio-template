/* Coverflow image rail prototype for portfolio scrollytelling.
   Loaded explicitly by the Vercel build; text cards and print layout remain unchanged. */
(function () {
    'use strict';

    const DESKTOP_QUERY = '(min-width: 1024px)';
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const smoothstep = (value) => {
        const t = clamp(value, 0, 1);
        return t * t * (3 - (2 * t));
    };

    let rafId = 0;

    function getTimeline(wrapper) {
        const sticky = wrapper.querySelector('.sticky');
        if (!sticky) return null;
        const viewportHeight = window.innerHeight || 1;
        const rect = wrapper.getBoundingClientRect();
        const stickyTop = Number.parseFloat(getComputedStyle(sticky).top) || Math.min(96, viewportHeight * 0.12);
        const stickyHeight = Math.max(1, sticky.offsetHeight || sticky.getBoundingClientRect().height || 1);
        const activeDistance = Math.max(1, rect.height - stickyHeight);
        const progress = clamp((stickyTop - rect.top) / activeDistance, 0, 1);
        return { sticky, stickyTop, activeDistance, progress };
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
        const eased = smoothstep(raw);
        const activeFloat = eased * (images.length - 1);
        const nearest = Math.round(activeFloat);

        track.style.setProperty('--coverflow-active', activeFloat.toFixed(4));
        wrapper.dataset.coverflowIndex = String(nearest);

        images.forEach((image, index) => {
            const offset = index - activeFloat;
            const abs = Math.abs(offset);
            const limited = clamp(offset, -3.25, 3.25);
            const scale = clamp(1 - (abs * 0.135), 0.58, 1);
            const opacity = clamp(1 - (abs * 0.27), 0.16, 1);
            const blur = clamp((abs - 0.7) * 0.75, 0, 2.2);
            const brightness = clamp(1 - (abs * 0.16), 0.48, 1);
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

        const prev = wrapper.querySelector('.coverflow-control-prev');
        const next = wrapper.querySelector('.coverflow-control-next');
        if (prev) prev.disabled = nearest <= 0;
        if (next) next.disabled = nearest >= images.length - 1;
    }

    function updateAll() {
        rafId = 0;
        if (!window.matchMedia(DESKTOP_QUERY).matches || window.matchMedia('print').matches) return;
        document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper.coverflow-ready')
            .forEach(renderTrack);
    }

    function requestUpdate() {
        if (!rafId) rafId = requestAnimationFrame(updateAll);
    }

    function scrollToIndex(wrapper, requestedIndex) {
        const track = wrapper.querySelector('.coverflow-track');
        const images = track ? Array.from(track.querySelectorAll('.scrolly-full-image')) : [];
        if (images.length < 2) return;
        const index = clamp(requestedIndex, 0, images.length - 1);
        const timeline = getTimeline(wrapper);
        if (!timeline) return;

        const startMove = 0.12;
        const endMove = 0.76;
        const ratio = images.length === 1 ? 0 : index / (images.length - 1);
        const targetProgress = startMove + (ratio * (endMove - startMove));
        const absoluteTop = window.scrollY + wrapper.getBoundingClientRect().top;
        const targetY = absoluteTop - timeline.stickyTop + (targetProgress * timeline.activeDistance);
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }

    function addControls(wrapper, track) {
        const host = track.parentElement;
        if (!host || host.querySelector('.coverflow-controls')) return;
        const controls = document.createElement('div');
        controls.className = 'coverflow-controls no-print';
        controls.innerHTML = `
            <button type="button" class="coverflow-control coverflow-control-prev" aria-label="Previous image">‹</button>
            <button type="button" class="coverflow-control coverflow-control-next" aria-label="Next image">›</button>
        `;
        host.appendChild(controls);
        controls.querySelector('.coverflow-control-prev').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const current = Number.parseInt(wrapper.dataset.coverflowIndex || '0', 10);
            scrollToIndex(wrapper, current - 1);
        });
        controls.querySelector('.coverflow-control-next').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const current = Number.parseInt(wrapper.dataset.coverflowIndex || '0', 10);
            scrollToIndex(wrapper, current + 1);
        });
    }

    function enhance() {
        document.querySelectorAll('body.layout-portfolio .experience-section .scrollytelling-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.scrollytelling-track');
            if (!track) return;
            const images = track.querySelectorAll('.scrolly-full-image');
            if (images.length < 2) return;
            wrapper.classList.add('coverflow-ready');
            track.classList.add('coverflow-track');
            addControls(wrapper, track);
        });
        requestUpdate();
    }

    const observer = new MutationObserver(() => enhance());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
    if (document.readyState !== 'loading') enhance();
})();
