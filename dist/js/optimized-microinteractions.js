/*
 * Optimized cursor-local 3x3 interaction runtime.
 * Replaces the legacy implementation after v49-app.js loads while preserving
 * the same DOM hooks and visual behavior expected by the existing CSS.
 */
(function () {
  'use strict';

  const GRID_ID = 'cursor-local-grid';
  const LEGACY_GRID_ID = 'mouse-grid-field';
  const CELL_SELECTOR = '.cursor-local-cell';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');

  let cleanupCurrent = null;

  function removeExistingGrids() {
    document.querySelectorAll(`#${LEGACY_GRID_ID}, #${GRID_ID}`).forEach(node => node.remove());
  }

  function removeLegacyListeners() {
    if (window._portfolioPointerMove) window.removeEventListener('pointermove', window._portfolioPointerMove);
    if (window._portfolioMouseMove) window.removeEventListener('mousemove', window._portfolioMouseMove);
    if (window._portfolioPointerLeave) window.removeEventListener('pointerleave', window._portfolioPointerLeave);
    if (window._portfolioDocLeave) document.removeEventListener('mouseleave', window._portfolioDocLeave);
    window._portfolioPointerMove = null;
    window._portfolioMouseMove = null;
    window._portfolioPointerLeave = null;
    window._portfolioDocLeave = null;
  }

  function shouldEnable() {
    return pointerQuery.matches && !motionQuery.matches && !document.hidden;
  }

  function createGrid() {
    let grid = document.getElementById(GRID_ID);
    if (grid) return grid;

    grid = document.createElement('div');
    grid.id = GRID_ID;
    grid.setAttribute('aria-hidden', 'true');
    const fragment = document.createDocumentFragment();
    for (let index = 1; index <= 9; index += 1) {
      const cell = document.createElement('span');
      cell.className = 'cursor-local-cell';
      cell.dataset.cell = String(index);
      fragment.appendChild(cell);
    }
    grid.appendChild(fragment);
    document.body.appendChild(grid);
    return grid;
  }

  function initOptimizedMicroInteractions() {
    if (cleanupCurrent) cleanupCurrent();
    removeLegacyListeners();

    if (!shouldEnable()) {
      removeExistingGrids();
      cleanupCurrent = null;
      return;
    }

    const grid = createGrid();
    const cells = Array.from(grid.querySelectorAll(CELL_SELECTOR));
    if (cells.length !== 9) {
      removeExistingGrids();
      cleanupCurrent = null;
      return;
    }

    const map = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],  [0, 0],  [1, 0],
      [-1, 1],  [0, 1],  [1, 1]
    ];
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (start, end, amount) => start + (end - start) * amount;

    let frameId = 0;
    let targetX = window.innerWidth / 2;
    let targetY = Math.max(160, window.innerHeight / 2);
    let currentX = targetX;
    let currentY = targetY;
    let hasPointer = false;
    let lastCellSize = 0;

    function stopFrame() {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function hide() {
      hasPointer = false;
      grid.classList.remove('is-active');
      stopFrame();
    }

    function draw() {
      frameId = 0;
      if (!shouldEnable() || !hasPointer || !document.body.classList.contains('layout-portfolio') || document.body.classList.contains('is-printing')) {
        hide();
        return;
      }

      currentX = lerp(currentX, targetX, 0.34);
      currentY = lerp(currentY, targetY, 0.34);
      const cellSize = clamp(Math.min(window.innerWidth, window.innerHeight) * 0.102, 70, 118);

      if (cellSize !== lastCellSize) {
        grid.style.setProperty('--cursor-grid-size', `${cellSize}px`);
        lastCellSize = cellSize;
      }
      grid.style.setProperty('--cursor-x', `${currentX}px`);
      grid.style.setProperty('--cursor-y', `${currentY}px`);
      grid.style.setProperty('--grid-offset-x', `${currentX % cellSize}px`);
      grid.style.setProperty('--grid-offset-y', `${currentY % cellSize}px`);

      for (let index = 0; index < cells.length; index += 1) {
        const cell = cells[index];
        const [gridX, gridY] = map[index];
        const isCenter = index === 4;
        const distance = Math.max(1, Math.hypot(gridX, gridY));
        const faceX = isCenter ? 0 : -gridX / distance;
        const faceY = isCenter ? 0 : -gridY / distance;
        const diagonal = Math.abs(gridX) + Math.abs(gridY) === 2;
        const maxAngle = diagonal ? 9.2 : 10.8;

        cell.style.cssText = [
          `--cell-left:${currentX + gridX * cellSize}px`,
          `--cell-top:${currentY + gridY * cellSize}px`,
          `--rx:${clamp(-faceY * maxAngle, -11, 11).toFixed(2)}deg`,
          `--ry:${clamp(faceX * maxAngle, -11, 11).toFixed(2)}deg`,
          `--tz:${isCenter ? 0 : 10}px`,
          `--cell-opacity:${isCenter ? 0.18 : 0.48}`,
          `--face-glow:${isCenter ? 0.18 : diagonal ? 0.48 : 0.58}`,
          `--shine-x:${clamp(50 + faceX * 28, 10, 90)}%`,
          `--shine-y:${clamp(50 + faceY * 28, 10, 90)}%`
        ].join(';');
        cell.classList.toggle('is-center', isCenter);
      }

      grid.classList.add('is-active');
      if (Math.abs(currentX - targetX) > 0.35 || Math.abs(currentY - targetY) > 0.35) {
        frameId = requestAnimationFrame(draw);
      }
    }

    function move(event) {
      if (!event || typeof event.clientX !== 'number') return;
      if (!shouldEnable() || !document.body.classList.contains('layout-portfolio')) {
        hide();
        return;
      }
      const modal = document.getElementById('edit-modal');
      if (modal && !modal.classList.contains('hidden')) {
        hide();
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPointer) {
        currentX = targetX;
        currentY = targetY;
        hasPointer = true;
      }
      if (!frameId) frameId = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      if (document.hidden) hide();
    }

    window._portfolioPointerMove = move;
    window._portfolioPointerLeave = hide;
    window._portfolioDocLeave = hide;
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', hide, { passive: true });
    document.addEventListener('mouseleave', hide, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    cleanupCurrent = function cleanup() {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', hide);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('visibilitychange', handleVisibility);
      cleanupCurrent = null;
    };
  }

  window.initMicroInteractions = initOptimizedMicroInteractions;

  function reinitialize() {
    initOptimizedMicroInteractions();
  }

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', reinitialize);
    pointerQuery.addEventListener('change', reinitialize);
  } else {
    motionQuery.addListener(reinitialize);
    pointerQuery.addListener(reinitialize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reinitialize, { once: true });
  } else {
    reinitialize();
  }
})();
