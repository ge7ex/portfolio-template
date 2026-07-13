const fs = require('fs');
const path = require('path');

const root = process.cwd();
const htmlPath = path.join(root, 'dist', 'index.html');
const runtimePaths = [
  path.join(root, 'public', 'legacy', 'v49-app.js'),
  path.join(root, 'dist', 'legacy', 'v49-app.js')
];

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
html = html.replace(/\/css\/mobile-nav\.css\?v=[^"]+/g, '/css/mobile-nav.css?v=1');

const coverflowCss = '<link rel="stylesheet" href="/css/coverflow-scrollytelling.css?v=2">';
const resumeThemeCss = '<link rel="stylesheet" href="/css/resume-theme-sync.css?v=1">';
const mobileNavCss = '<link rel="stylesheet" href="/css/mobile-nav.css?v=1">';
const coverflowJs = '<script src="/js/coverflow-scrollytelling.js?v=2"></script>';

if (!html.includes('/css/coverflow-scrollytelling.css')) {
  html = html.replace('</head>', `    ${coverflowCss}\n</head>`);
}
if (!html.includes('/css/resume-theme-sync.css')) {
  html = html.replace('</head>', `    ${resumeThemeCss}\n</head>`);
}
if (!html.includes('/css/mobile-nav.css')) {
  html = html.replace('</head>', `    ${mobileNavCss}\n</head>`);
}
if (!html.includes('/js/coverflow-scrollytelling.js')) {
  html = html.replace('</body>', `    ${coverflowJs}\n</body>`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Prepared active v49 timing, responsive coverflow phases, resume theme synchronization, and centered mobile navigation.');