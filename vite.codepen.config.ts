import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Read metadata dynamically
const metadataPath = path.resolve(__dirname, 'metadata.json');
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

export default defineConfig({
  define: {
    __APP_CONFIG__: JSON.stringify(appConfig)
  },
  plugins: [
    cssInjectedByJsPlugin()
  ],
  build: {
    outDir: 'dist-codepen',
    emptyOutDir: true,
    minify: false, // Keep it readable for CodePen
    assetsInlineLimit: 100000000, // Inline assets
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'IdleGame',
      formats: ['iife'],
      fileName: () => 'codepen.js'
    }
  }
});