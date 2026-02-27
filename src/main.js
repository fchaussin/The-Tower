import './index.css';
import { Game } from './game/Game.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

const canvas = document.getElementById('gameCanvas');
new Game(canvas);

// Remove splash screen once all assets (including fonts) are fully loaded
Promise.all([
  new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve);
  }),
  document.fonts ? document.fonts.ready : Promise.resolve()
]).then(() => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Use transitionend instead of setTimeout to perfectly sync with CSS
    splash.addEventListener('transitionend', () => splash.remove());
    splash.style.opacity = '0';
  }
});
