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
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('Patched the active v49 scrollytelling engine in public and dist.');
