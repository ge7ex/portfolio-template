const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => { throw new Error(`[runtime-audit] ${message}`); };
const count = (text, needle) => text.split(needle).length - 1;

const requiredFiles = [
  'dist/index.html',
  'dist/legacy/v49-app.js',
  'dist/js/optimized-microinteractions.js',
  'public/js/optimized-microinteractions.js',
  'dist/css/runtime-hardening.css',
  'public/css/runtime-hardening.css',
  'dist/css/print.css',
  'public/css/print.css'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
}

const html = read('dist/index.html');
const legacy = read('dist/legacy/v49-app.js');
const optimizedDist = read('dist/js/optimized-microinteractions.js');
const optimizedPublic = read('public/js/optimized-microinteractions.js');
const hardeningDist = read('dist/css/runtime-hardening.css');
const hardeningPublic = read('public/css/runtime-hardening.css');
const printDist = read('dist/css/print.css');
const printPublic = read('public/css/print.css');

const legacyScript = '/legacy/v49-app.js';
const optimizedScript = '/js/optimized-microinteractions.js?v=1';
const hardeningCss = '/css/runtime-hardening.css?v=1';
const printCss = '/css/print.css?v=1';

if (count(html, optimizedScript) !== 1) fail('Optimized microinteraction script must be injected exactly once.');
if (count(html, hardeningCss) !== 1) fail('Runtime hardening CSS must be injected exactly once.');
if (count(html, printCss) !== 1) fail('Print CSS must be injected exactly once.');
if (html.includes('/js/adaptive-scrollytelling.js')) fail('Deprecated adaptive-scrollytelling runtime is still active.');

const legacyIndex = html.indexOf(legacyScript);
const optimizedIndex = html.indexOf(optimizedScript);
const hardeningIndex = html.indexOf(hardeningCss);
const printIndex = html.indexOf(printCss);
if (legacyIndex < 0) fail('Legacy v49 runtime script is missing from dist HTML.');
if (optimizedIndex <= legacyIndex) fail('Optimized microinteraction runtime must load after v49-app.js.');
if (hardeningIndex < 0 || printIndex <= hardeningIndex) fail('Print CSS must load after runtime-hardening CSS.');

if (legacy.includes('v43: robust cursor-local seamless 3x3 tilt grid')) fail('Legacy 3x3 cursor implementation was not stripped from deployed runtime.');
if (!legacy.includes('optimized-microinteractions.js owns the active cursor runtime')) fail('Legacy runtime compatibility stub marker is missing.');
if (legacy.includes('window._portfolioMouseMove = move')) fail('Legacy cursor mousemove ownership remains in deployed runtime.');
if (legacy.includes("Array.from({ length: 9 }, (_, i) => `<span class=\"cursor-local-cell\"")) fail('Legacy cursor grid creation remains in deployed runtime.');

if (optimizedDist !== optimizedPublic) fail('Optimized microinteraction source differs between public and dist.');
if (hardeningDist !== hardeningPublic) fail('Runtime hardening CSS differs between public and dist.');
if (printDist !== printPublic) fail('Print CSS differs between public and dist.');

if (count(optimizedDist, "addEventListener('pointermove'") !== 1) fail('Optimized runtime must register exactly one pointermove listener.');
if (/addEventListener\(\s*['"]mousemove['"]/.test(optimizedDist)) fail('Optimized runtime must not register mousemove.');
if (!optimizedDist.includes('document.hidden')) fail('Optimized runtime must stop work in hidden tabs.');
if (!optimizedDist.includes('(hover: hover) and (pointer: fine) and (min-width: 768px)')) fail('Optimized runtime is missing the fine-pointer desktop gate.');
if (!optimizedDist.includes('prefers-reduced-motion: reduce')) fail('Optimized runtime is missing reduced-motion support.');

console.log('[runtime-audit] PASS: deploy assets, injection order, cursor runtime ownership, and source parity verified.');
