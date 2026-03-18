import './index.css';
import { Game } from './game/Game.js';

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
});

document.addEventListener('DOMContentLoaded', () => {
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
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.matchMedia('(display-mode: fullscreen)').matches || 
                       window.navigator.standalone;
  
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
