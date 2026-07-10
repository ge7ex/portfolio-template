const fs = require('fs');
const path = require('path');

const root = process.cwd();
const source = path.join(root, 'public', 'js', 'adaptive-scrollytelling.js');
const targetDir = path.join(root, 'dist', 'js');
const target = path.join(targetDir, 'adaptive-scrollytelling.js');
const htmlPath = path.join(root, 'dist', 'index.html');
const scriptSrc = '/js/adaptive-scrollytelling.js?v=20260710-4';
const scriptTag = `<script src="${scriptSrc}"></script>`;

if (!fs.existsSync(source)) {
  throw new Error(`Missing source runtime: ${source}`);
}

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Missing prebuilt HTML: ${htmlPath}`);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\s*<script src="\/js\/adaptive-scrollytelling\.js\?v=[^"]+"><\/script>/g, '');

if (!html.includes('</body>')) {
  throw new Error('Could not find </body> in dist/index.html');
}

html = html.replace('</body>', `    ${scriptTag}\n</body>`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('Prepared adaptive scrollytelling runtime for Vercel.');
