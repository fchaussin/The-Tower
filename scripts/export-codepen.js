import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building for CodePen...');
try {
  execSync('npx vite build --config vite.codepen.config.ts', { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to build for codepen:', err);
  process.exit(1);
}

const distDir = path.resolve(__dirname, '../dist-codepen');

// Read metadata dynamically
const metadataPath = path.resolve(__dirname, '../metadata.json');
let metadata = { name: '', description: '' };
try {
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  }
} catch (e) {
  console.error('Failed to read metadata.json', e);
}

const appConfig = {
  name: metadata.name || 'Idle Tower Defense',
  shortName: metadata.name === 'Idle Tower Defense' ? 'Idle TD' : (metadata.name ? metadata.name.substring(0, 12) : 'Idle TD'),
  description: metadata.description || 'A minimalist tower defense game',
  themeColor: '#111111',
  backgroundColor: '#111111'
};

const injectionCode = `// --- GLOBAL CONFIGURATION ---
const __APP_CONFIG__ = ${JSON.stringify(appConfig, null, 2)};
const __DISABLE_FIREBASE__ = true;
// ----------------------------

`;

const rawJsCode = fs.readFileSync(path.resolve(distDir, 'codepen.js'), 'utf-8');
const jsCode = injectionCode + rawJsCode;

fs.writeFileSync(path.resolve(distDir, 'codepen.js'), jsCode);

let cssCode = '';
try {
  cssCode = fs.readFileSync(path.resolve(distDir, 'style.css'), 'utf-8');
} catch (e) {
  console.error('Warning: could not find style.css');
}

const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

// Extract the contents of <body> to put in the HTML panel
let bodyMatch = indexHtml.match(/<body>([\s\S]*?)<\/body>/i);
let htmlCode = bodyMatch ? bodyMatch[1] : '';

// Remove script tags from the HTML since we are putting all JS in the JS panel
htmlCode = htmlCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
htmlCode = htmlCode.trim();

// CodePen Data object
const penData = {
  title: "Idle Tower Defense",
  description: "Exported from AI Studio",
  html: htmlCode,
  css: cssCode,
  js: jsCode,
  editors: "101", // Show HTML and JS
};

const outputHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Export to CodePen</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #111; color: #fff; margin: 0; }
    .container { text-align: center; max-width: 600px; padding: 40px; background: #222; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    button { padding: 16px 32px; font-size: 1.2rem; font-weight: bold; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 8px; transition: background 0.2s; margin-top: 20px;}
    button:hover { background: #45a049; }
    p { color: #aaa; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your CodePen Build is Ready!</h1>
    <p>We've compiled all your JavaScript, extracted your CSS, and formatted your HTML for CodePen.</p>
    <form action="https://codepen.io/pen/define" method="POST" target="_blank">
      <input type="hidden" name="data" value='${JSON.stringify(penData).replace(/'/g, "&apos;")}'>
      <button type="submit">🚀 Open in CodePen</button>
    </form>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 0.9em;">
       <p>If the button above fails (CodePen has a size limit for auto-imports), you can manually copy the files:</p>
       <a href="./codepen.js" target="_blank" style="color: #4caf50; text-decoration: none;">View codepen.js</a> |
       <a href="./style.css" target="_blank" style="color: #4caf50; text-decoration: none;">View style.css</a> |
       <a href="../index.html" target="_blank" style="color: #4caf50; text-decoration: none;">View original HTML</a>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.resolve(distDir, 'export.html'), outputHtml);
console.log('\n✅ CodePen export ready!');
console.log('You can find the export files in the dist-codepen/ folder.');
console.log('Open dist-codepen/export.html in your browser to push directly to CodePen.');
