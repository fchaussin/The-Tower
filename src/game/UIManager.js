import { auth, db, provider, signInWithPopup, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy, limit, isFirebaseEnabled } from '../services/firebase.js';
import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { ChainFeature } from './features/ChainFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    console.log('UIManager constructor running, looking for buttons...');
    this.formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
    
    this.mainMenuEl = document.getElementById('main-menu');
    this.gameOverMenuEl = document.getElementById('game-over-menu');
    this.playerNameInput = document.getElementById('playerName');
    this.scoreListEl = document.getElementById('scoreList');
    
    this.loginBtn = document.getElementById('loginBtn');
    this.userInfo = document.getElementById('userInfo');
    this.authSection = document.getElementById('auth-section');
    
    this.playerNameInput.value = this.game.playerName;
  }

  setup() {
    if (isFirebaseEnabled && this.authSection) {
      this.authSection.classList.remove('hidden');
      
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (this.loginBtn) this.loginBtn.classList.add('hidden');
          if (this.userInfo) {
            this.userInfo.classList.remove('hidden');
            this.userInfo.innerText = `Logged in as: ${user.displayName}`;
          }
          
          const username = user.displayName;
          if (this.playerNameInput) this.playerNameInput.value = username;
          this.game.playerName = username;
          localStorage.setItem('tower_playerName', this.game.playerName);
        } else {
          if (this.loginBtn) this.loginBtn.classList.remove('hidden');
          if (this.userInfo) this.userInfo.classList.add('hidden');
        }
      });
      
      if (this.loginBtn) {
        this.loginBtn.addEventListener('click', async () => {
          try {
            await signInWithPopup(auth, provider);
          } catch (error) {
            console.error("Login failed", error);
          }
        });
      }
    }
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.game.playerName = this.playerNameInput ? this.playerNameInput.value.trim() || 'Anonymous' : 'Anonymous';
        localStorage.setItem('tower_playerName', this.game.playerName);
        if (this.mainMenuEl) this.mainMenuEl.classList.add('hidden');
        this.game.audioManager.init();
        this.game.reset();
        this.game.state = 'PLAYING';
        this.game.lastTime = performance.now();
      });
    } else console.warn('startBtn not found');
    
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (this.gameOverMenuEl) this.gameOverMenuEl.classList.add('hidden');
        this.game.reset();
        this.game.state = 'PLAYING';
        this.game.lastTime = performance.now();
      });
    } else console.warn('restartBtn not found');

    const mainMenuBtn = document.getElementById('mainMenuBtn');
    if (mainMenuBtn) {
      mainMenuBtn.addEventListener('click', () => {
        if (this.gameOverMenuEl) this.gameOverMenuEl.classList.add('hidden');
        if (this.mainMenuEl) this.mainMenuEl.classList.remove('hidden');
        this.game.state = 'MENU';
      });
    } else console.warn('mainMenuBtn not found');

    const helpModal = document.getElementById('help-modal');
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        if (this.mainMenuEl) this.mainMenuEl.classList.add('hidden');
        if (helpModal) helpModal.classList.remove('hidden');
      });
    } else console.warn('helpBtn not found');

    const closeHelpBtn = document.getElementById('closeHelpBtn');
    if (closeHelpBtn) {
      closeHelpBtn.addEventListener('click', () => {
        if (helpModal) helpModal.classList.add('hidden');
        if (this.game.state === 'MENU' && this.mainMenuEl) {
          this.mainMenuEl.classList.remove('hidden');
        }
      });
    } else console.warn('closeHelpBtn not found');

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });

      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          fullscreenBtn.innerText = 'ENTER FULLSCREEN';
        } else {
          fullscreenBtn.innerText = 'EXIT FULLSCREEN';
        }
      });
    } else console.warn('fullscreenBtn not found');

    this.renderTowerFeatureIcons();
  }

  renderIcon(canvasId, feature) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = feature.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      feature.draw(ctx, 0, 0, canvas.width, canvas.height, feature.color);
    }
  }

  renderTowerFeatureIcons() {
    const features = [
      { id: 'icon-damage', feature: new DamageFeature() },
      { id: 'icon-poison', feature: new PoisonFeature() },
      { id: 'icon-speed', feature: new SpeedFeature() },
      { id: 'icon-range', feature: new RangeFeature() },
      { id: 'icon-chain', feature: new ChainFeature() },
      { id: 'icon-splash', feature: new SplashFeature() },
      { id: 'icon-cooldown', feature: new CooldownFeature() }
    ];

    features.forEach(({ id, feature }) => {
      this.renderIcon(id, feature);
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  formatNumber(num) {
    return this.formatter.format(num);
  }

  formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  async updateLeaderboard() {
    if (!this.scoreListEl) return;
    
    const loader = document.getElementById('scoreLoader');
    if (loader) loader.classList.remove('hidden');
    this.scoreListEl.classList.add('hidden');
    
    let scoresToDisplay = this.game.topScores;
    
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
        ]);
        const fbScores = [];
        querySnapshot.forEach((doc) => {
          fbScores.push(doc.data());
        });
        if (fbScores.length > 0) {
          scoresToDisplay = fbScores;
        }
      } catch (e) {
        console.warn("Could not fetch scores from Firebase, falling back to local storage.", e.message);
      }
    }
    
    if (loader) loader.classList.add('hidden');
    this.scoreListEl.classList.remove('hidden');
    
    this.scoreListEl.innerHTML = '';
    scoresToDisplay.forEach((entry, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${this.formatNumber(entry.score)}</span>`;
      this.scoreListEl.appendChild(li);
    });
  }

  async saveScore() {
    this.game.topScores.push({ name: this.game.playerName, score: this.game.score });
    this.game.topScores.sort((a, b) => b.score - a.score);
    this.game.topScores = this.game.topScores.slice(0, 10);
    localStorage.setItem('tower_topScores', JSON.stringify(this.game.topScores));
    
    if (isFirebaseEnabled) {
      try {
        await addDoc(collection(db, 'scores'), {
          name: this.game.playerName,
          score: this.game.score,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Could not save score to Firebase, saved locally.", e.message);
      }
    }
    
    this.updateLeaderboard();
  }

  showGameOver() {
    const finalScoreEl = document.getElementById('finalScore');
    if (finalScoreEl) finalScoreEl.innerText = `Score: ${this.formatNumber(this.game.score)}`;
    const finalLevelEl = document.getElementById('finalLevel');
    if (finalLevelEl) finalLevelEl.innerText = `Level: ${this.game.level}`;
    if (this.gameOverMenuEl) this.gameOverMenuEl.classList.remove('hidden');
  }
}
