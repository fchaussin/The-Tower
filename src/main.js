import './index.css';
import { Game } from './game/Game.js';

// Register service worker for offline PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// PWA Install Prompt Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  const installBtns = document.querySelectorAll('.installAppBtn');
  installBtns.forEach(installBtn => {
    installBtn.classList.remove('hidden');
    
    installBtn.addEventListener('click', async () => {
      // Hide the app provided install promotion
      installBtns.forEach(btn => btn.classList.add('hidden'));
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  const installBtns = document.querySelectorAll('.installAppBtn');
  installBtns.forEach(btn => btn.classList.add('hidden'));
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  console.log('PWA was installed');
});

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
