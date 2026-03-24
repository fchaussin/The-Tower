import './index.css';
import { Game } from './game/Game.js';
import { UAParser } from 'ua-parser-js';
import QRCode from 'qrcode';

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  document.querySelectorAll('.installAppBtn').forEach(btn => {
    btn.classList.remove('hidden');
  });
  
  // Update the enforcer overlay title and description
  const enforcerTitle = document.getElementById('pwa-enforcer-title');
  const enforcerDesc = document.getElementById('pwa-enforcer-desc');
  if (enforcerTitle) enforcerTitle.innerText = 'Install Required';
  if (enforcerDesc) enforcerDesc.innerText = 'To play on mobile, you must install the game to your home screen. This ensures a smooth, full-screen experience.';

  // Show the specific Android install button in the enforcer overlay
  const promptAvailable = document.getElementById('pwa-prompt-available');
  const promptUnavailable = document.getElementById('pwa-prompt-unavailable');
  if (promptAvailable) promptAvailable.classList.remove('hidden');
  if (promptUnavailable) promptUnavailable.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  console.log('App installed successfully');
  
  const enforcerTitle = document.getElementById('pwa-enforcer-title');
  const enforcerDesc = document.getElementById('pwa-enforcer-desc');
  if (enforcerTitle) enforcerTitle.innerText = 'App Installed';
  if (enforcerDesc) enforcerDesc.innerText = 'Game installed successfully! Please launch it from your home screen to play.';

  const promptAvailable = document.getElementById('pwa-prompt-available');
  const promptUnavailable = document.getElementById('pwa-prompt-unavailable');
  const instructionsIos = document.getElementById('pwa-instructions-ios');
  const instructionsAndroid = document.getElementById('pwa-instructions-android');
  
  if (promptAvailable) promptAvailable.classList.add('hidden');
  if (promptUnavailable) promptUnavailable.classList.add('hidden');
  if (instructionsIos) instructionsIos.classList.add('hidden');
  if (instructionsAndroid) instructionsAndroid.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  // --- PWA ENFORCER LOGIC ---
  const parser = new UAParser();
  const device = parser.getDevice();
  const os = parser.getOS();
  
  const isMobileDevice = device.type === 'mobile' || device.type === 'tablet' || device.type === 'wearable';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.matchMedia('(display-mode: fullscreen)').matches || 
                       window.navigator.standalone;

  // If it's a desktop device, block the game and show QR code
  if (!isMobileDevice) {
    const desktopOverlay = document.getElementById('desktop-enforcer-overlay');
    if (desktopOverlay) {
      desktopOverlay.classList.remove('hidden');
      
      const qrCanvas = document.getElementById('desktop-qr-code');
      if (qrCanvas) {
        QRCode.toCanvas(qrCanvas, window.location.href, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }, function (error) {
          if (error) console.error(error);
        });
      }
    }
    
    // Hide the splash screen immediately so the overlay is visible
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      splashScreen.style.display = 'none';
    }
    
    // Stop execution here, don't initialize the game
    return;
  }

  // If it's a mobile device and NOT running as a standalone PWA, block the game
  if (isMobileDevice && !isStandalone) {
    const enforcerOverlay = document.getElementById('pwa-enforcer-overlay');
    if (enforcerOverlay) {
      enforcerOverlay.classList.remove('hidden');
      
      // Show OS-specific instructions
      if (os.name === 'iOS' || os.name === 'Mac OS') {
        document.getElementById('pwa-instructions-ios')?.classList.remove('hidden');
      } else {
        document.getElementById('pwa-instructions-android')?.classList.remove('hidden');
      }
    }
    
    // Hide the splash screen immediately so the overlay is visible
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      splashScreen.style.display = 'none';
    }
    
    // Handle the Android install button in the overlay
    const pwaInstallBtn = document.getElementById('pwa-install-btn');
    if (pwaInstallBtn) {
      pwaInstallBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        }
      });
    }
    
    // Stop execution here, don't initialize the game
    return;
  }
  // --- END PWA ENFORCER LOGIC ---

  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  
  // Handle install button clicks
  document.querySelectorAll('.installAppBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        document.querySelectorAll('.installAppBtn').forEach(b => b.classList.add('hidden'));
      }
    });
  });

  // Hide splash screen
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.style.opacity = '0';
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 500);
    }, 500);
  }

  // Auto-fullscreen for PWA on first interaction
  if (isStandalone) {
    const requestFS = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
      document.removeEventListener('click', requestFS);
      document.removeEventListener('touchstart', requestFS);
    };
    document.addEventListener('click', requestFS);
    document.addEventListener('touchstart', requestFS);
  }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update available
            console.log('New update available, prompting user...');
            
            const notification = document.createElement('div');
            notification.style.cssText = `
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: var(--bg-menu, rgba(17, 17, 17, 0.95));
              color: var(--text-main, #fff);
              padding: 15px 20px;
              border-radius: 8px;
              border: 1px solid var(--accent-primary, #0df);
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              z-index: 10000;
              display: flex;
              align-items: center;
              gap: 15px;
              font-family: var(--font-mono, monospace);
            `;
            
            notification.innerHTML = `
              <span>New version available!</span>
              <div style="display:flex;gap:10px;">
                <button id="update-btn" style="background:var(--accent-primary, #0df);color:var(--bg-color, #111);border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-weight:bold;font-family:inherit;">Update</button>
                <button id="dismiss-btn" style="background:transparent;color:var(--text-muted, #aaa);border:1px solid var(--border-input, #555);padding:5px 10px;border-radius:4px;cursor:pointer;font-family:inherit;">Dismiss</button>
              </div>
            `;
            
            document.body.appendChild(notification);
            
            document.getElementById('update-btn').addEventListener('click', () => {
              if (caches) {
                caches.keys().then(names => {
                  for (let name of names) caches.delete(name);
                });
              }
              window.location.reload();
            });
            
            document.getElementById('dismiss-btn').addEventListener('click', () => {
              notification.remove();
            });
          }
        });
      });
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Force clear caches if we're stuck
if (caches) {
  caches.keys().then(names => {
    for (let name of names) {
      if (name.startsWith('idle-td-cache')) {
        caches.delete(name);
      }
    }
  });
}
