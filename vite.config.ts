import { defineConfig } from 'vite';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
import fs from 'fs';
import path from 'path';

// Read metadata dynamically to avoid Node.js module caching
const metadataPath = path.resolve(__dirname, 'metadata.json');
let metadata = { name: '', description: '' };
try {
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  }
} catch (e) {
  console.error('Failed to read metadata.json', e);
}

// Default values for PWA and theme
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
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/__APP_NAME__/g, appConfig.name)
          .replace(/__APP_SHORT_NAME__/g, appConfig.shortName)
          .replace(/__APP_DESC__/g, appConfig.description)
          .replace(/__THEME_COLOR__/g, appConfig.themeColor);
      }
    },
    obfuscatorPlugin({
      include: ['src/**/*.js', 'src/**/*.ts'],
      exclude: [/node_modules/],
      apply: 'build',
      debugger: false,
      options: {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
