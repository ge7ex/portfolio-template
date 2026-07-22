const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const htmlPath = path.join(root, 'dist', 'index.html');
const runtimePaths = [
  path.join(root, 'public', 'legacy', 'v49-app.js'),
  path.join(root, 'dist', 'legacy', 'v49-app.js')
];

const mirroredAssets = [
  ['public/css/print.css', 'dist/css/print.css'],
  ['public/css/runtime-hardening.css', 'dist/css/runtime-hardening.css'],
  ['public/js/optimized-microinteractions.js', 'dist/js/optimized-microinteractions.js']
];

for (const [sourceRelative, targetRelative] of mirroredAssets) {
  const source = path.join(root, sourceRelative);
  const target = path.join(root, targetRelative);
  if (!fs.existsSync(source)) throw new Error(`Missing canonical asset: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

const oldThresholds = `                        const startMove = 0.045;
                        const endMove = 0.86;
                        const collapseAfter = 0.905;`;

const newThresholds = `                        // Cinematic timeline: closed lead-in -> open -> pan -> final hold -> close -> closed exit.
                        const openAfter = 0.06;
                        const startMove = 0.12;
                        const endMove = 0.76;
                        const collapseAfter = 0.90;`;

const oldActivity = `                        const isOpeningWindow = progress > 0.018;
                        const isBeforeTerminalCollapse = progress < collapseAfter;
                        const isActive = isInViewport && isOpeningWindow && isBeforeTerminalCollapse;`;

const newActivity = `                        const isOpeningWindow = progress > openAfter;
                        const isBeforeTerminalCollapse = progress < collapseAfter;
                        const isActive = isInViewport && isOpeningWindow && isBeforeTerminalCollapse;`;

const legacyCursorStart = '        /* v43: robust cursor-local seamless 3x3 tilt grid';
const legacyCursorEnd = '        let hasBootedPortfolioApp = false;';
const pressurePatchStart = '/* ==================================\n   V2 parity patch: cursor-pressure microinteraction + low-spec lazy behaviour';
const cursorCompatibilityStub = `        /* optimized-microinteractions.js owns the active cursor runtime. */
        function ensureCursorLocalGrid() {
            return document.getElementById('cursor-local-grid');
        }

        function initMicroInteractions() {
            const activeRuntime = window.initMicroInteractions;
            if (typeof activeRuntime === 'function' && activeRuntime !== initMicroInteractions) {
                activeRuntime();
            }
        }

        let hasBootedPortfolioApp = false;`;

for (const runtimePath of runtimePaths) {
  if (!fs.existsSync(runtimePath)) {
    throw new Error(`Missing active runtime: ${runtimePath}`);
  }

  let code = fs.readFileSync(runtimePath, 'utf8');

  if (code.includes(oldThresholds)) {
    code = code.replace(oldThresholds, newThresholds);
  } else if (!code.includes('const openAfter = 0.06;')) {
    throw new Error(`Could not find v49 scrollytelling threshold block in ${runtimePath}`);
  }

  if (code.includes(oldActivity)) {
    code = code.replace(oldActivity, newActivity);
  } else if (!code.includes('const isOpeningWindow = progress > openAfter;')) {
    throw new Error(`Could not find v49 scrollytelling activity block in ${runtimePath}`);
  }

  if (!code.includes('optimized-microinteractions.js owns the active cursor runtime')) {
    const startIndex = code.indexOf(legacyCursorStart);
    const endIndex = code.indexOf(legacyCursorEnd, startIndex);
    if (startIndex < 0 || endIndex < 0) {
      throw new Error(`Could not isolate legacy cursor runtime in ${runtimePath}`);
    }
    code = `${code.slice(0, startIndex)}${cursorCompatibilityStub}${code.slice(endIndex + legacyCursorEnd.length)}`;
  }

  const pressurePatchIndex = code.indexOf(pressurePatchStart);
  if (pressurePatchIndex >= 0) {
    code = `${code.slice(0, pressurePatchIndex).trimEnd()}\n`;
  }

  fs.writeFileSync(runtimePath, code, 'utf8');
}

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Missing prebuilt HTML: ${htmlPath}`);
}

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\s*<script src="\/js\/adaptive-scrollytelling\.js\?v=[^"]+"><\/script>/g, '');
html = html.replace(/\/css\/coverflow-scrollytelling\.css\?v=[^"]+/g, '/css/coverflow-scrollytelling.css?v=2');
html = html.replace(/\/js\/coverflow-scrollytelling\.js\?v=[^"]+/g, '/js/coverflow-scrollytelling.js?v=2');
html = html.replace(/\/css\/resume-theme-sync\.css\?v=[^"]+/g, '/css/resume-theme-sync.css?v=1');
html = html.replace(/\/css\/mobile-nav\.css\?v=[^"]+/g, '/css/mobile-nav.css?v=3');
html = html.replace(/\/css\/runtime-hardening\.css\?v=[^"]+/g, '/css/runtime-hardening.css?v=1');
html = html.replace(/\/css\/print\.css\?v=[^"]+/g, '/css/print.css?v=1');
html = html.replace(/\/js\/mobile-nav-center\.js\?v=[^"]+/g, '/js/mobile-nav-center.js?v=1');
html = html.replace(/\/js\/optimized-microinteractions\.js\?v=[^"]+/g, '/js/optimized-microinteractions.js?v=1');

const coverflowCss = '<link rel="stylesheet" href="/css/coverflow-scrollytelling.css?v=2">';
const resumeThemeCss = '<link rel="stylesheet" href="/css/resume-theme-sync.css?v=1">';
const mobileNavCss = '<link rel="stylesheet" href="/css/mobile-nav.css?v=3">';
const runtimeHardeningCss = '<link rel="stylesheet" href="/css/runtime-hardening.css?v=1">';
const printCss = '<link rel="stylesheet" href="/css/print.css?v=1" media="print">';
const coverflowJs = '<script src="/js/coverflow-scrollytelling.js?v=2"></script>';
const mobileNavJs = '<script src="/js/mobile-nav-center.js?v=1"></script>';
const optimizedMicroInteractionsJs = '<script src="/js/optimized-microinteractions.js?v=1"></script>';

if (!html.includes('/css/coverflow-scrollytelling.css')) {
  html = html.replace('</head>', `    ${coverflowCss}\n</head>`);
}
if (!html.includes('/css/resume-theme-sync.css')) {
  html = html.replace('</head>', `    ${resumeThemeCss}\n</head>`);
}
if (!html.includes('/css/mobile-nav.css')) {
  html = html.replace('</head>', `    ${mobileNavCss}\n</head>`);
}
if (!html.includes('/css/runtime-hardening.css')) {
  html = html.replace('</head>', `    ${runtimeHardeningCss}\n</head>`);
}
if (!html.includes('/css/print.css')) {
  html = html.replace('</head>', `    ${printCss}\n</head>`);
}
if (!html.includes('/js/coverflow-scrollytelling.js')) {
  html = html.replace('</body>', `    ${coverflowJs}\n</body>`);
}
if (!html.includes('/js/mobile-nav-center.js')) {
  html = html.replace('</body>', `    ${mobileNavJs}\n</body>`);
}
if (!html.includes('/js/optimized-microinteractions.js')) {
  html = html.replace('</body>', `    ${optimizedMicroInteractionsJs}\n</body>`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
execFileSync(process.execPath, [path.join(root, 'scripts', 'audit-runtime.cjs')], { stdio: 'inherit' });
console.log('Prepared active v49 timing, removed duplicate cursor runtimes, synchronized deploy assets, and verified optimized A4 output.');
