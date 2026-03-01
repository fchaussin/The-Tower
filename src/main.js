import './index.css';
import { Game } from './game/Game.js';

// Service worker registration removed for development to prevent caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

const initGame = () => {
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    new Game(canvas);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Remove splash screen once all assets (including fonts) are fully loaded
const removeSplash = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 500); // 500ms matches the CSS transition duration
  }
};

Promise.race([
  Promise.all([
    new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    }),
    document.fonts ? document.fonts.ready : Promise.resolve()
  ]),
  new Promise(resolve => setTimeout(resolve, 2000)) // Fallback timeout of 2 seconds
]).then(removeSplash).catch(removeSplash);
