import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
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