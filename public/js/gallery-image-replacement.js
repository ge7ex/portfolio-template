/* One-time migration: replace the specific landscape jazz photo with the approved portrait version.
   Matching is perceptual so the browser-resized JPEG stored in localStorage can be identified
   without touching unrelated gallery images. */
(function () {
  'use strict';

  const MIGRATION_KEY = 'ge7ex-gallery-jazz-portrait-v1';
  const REPLACEMENT_URL = '/assets/jazz-performance-portrait.jpg?v=1';
  const TARGET = [17,40,71,108,164,128,126,110,149,136,53,26,17,13,29,15,23,46,84,114,154,127,119,96,144,129,67,37,27,19,33,16,16,38,79,94,131,162,129,119,144,88,66,38,29,21,35,15,5,13,65,108,125,143,125,108,132,86,59,34,26,22,31,13,6,8,25,65,77,101,114,60,94,92,57,33,28,19,13,6,7,11,19,50,81,77,81,53,52,55,51,55,32,14,8,6,7,10,16,61,107,90,84,66,80,55,49,43,26,12,9,7,7,10,22,72,84,70,58,51,86,58,39,31,24,12,9,7,8,11,31,118,66,53,54,46,76,72,44,31,27,12,8,6,26,26,52,120,66,64,51,50,50,73,37,24,28,13,8,6,55,70,72,85,33,85,60,37,43,58,43,33,32,17,9,5,40,57,68,57,27,82,53,26,33,42,21,16,24,23,17,7,20,29,48,70,54,73,60,29,28,40,21,16,20,28,27,14,19,31,39,67,74,112,87,67,49,92,25,18,18,22,18,16,24,30,30,53,67,72,66,64,47,68,36,18,19,21,21,11,19,17,11,24,45,41,61,110,73,45,35,25,17,17,18,10];

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function fingerprint(img) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, 16, 16);
    const pixels = ctx.getImageData(0, 0, 16, 16).data;
    const out = [];
    for (let i = 0; i < pixels.length; i += 4) {
      out.push(Math.round((pixels[i] * 0.299) + (pixels[i + 1] * 0.587) + (pixels[i + 2] * 0.114)));
    }
    return out;
  }

  function score(a, b) {
    let total = 0;
    for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i]);
    return total / a.length;
  }

  async function assetAsDataUrl() {
    const response = await fetch(REPLACEMENT_URL, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`portrait asset HTTP ${response.status}`);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function migrate() {
    if (localStorage.getItem(MIGRATION_KEY) === 'done') return;
    if (typeof StorageHandler === 'undefined' || typeof render !== 'function') return;

    const data = StorageHandler.load();
    const candidates = [];
    (data.exp || []).forEach((exp, expIndex) => {
      (exp.images || []).forEach((src, imageIndex) => {
        if (typeof src === 'string' && src.startsWith('data:image/')) {
          candidates.push({ expIndex, imageIndex, src });
        }
      });
    });
    if (!candidates.length) return;

    let best = null;
    for (const candidate of candidates) {
      try {
        const img = await loadImage(candidate.src);
        const ratio = img.naturalWidth / Math.max(1, img.naturalHeight);
        if (ratio < 1.45 || ratio > 1.55) continue;
        const candidateScore = score(fingerprint(img), TARGET);
        if (!best || candidateScore < best.score) best = { ...candidate, score: candidateScore };
      } catch (_) {}
    }

    // Tight enough to avoid touching a merely similar 3:2 gallery photo.
    if (!best || best.score > 18) {
      console.info('[gallery-migration] target jazz image not found; no data changed.');
      return;
    }

    const replacement = await assetAsDataUrl();
    data.exp[best.expIndex].images[best.imageIndex] = replacement;
    StorageHandler.save(data);
    localStorage.setItem(MIGRATION_KEY, 'done');
    render(data);
    console.info('[gallery-migration] replaced approved jazz image with portrait asset.', { score: best.score.toFixed(2) });
  }

  function start() {
    setTimeout(() => migrate().catch(err => console.warn('[gallery-migration] skipped:', err)), 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
