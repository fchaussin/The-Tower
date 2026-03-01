import { auth, db, provider, signInWithPopup, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy, limit, isFirebaseEnabled, SCORES_COLLECTION, serverTimestamp } from '../services/firebase.js';
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
    
    // Ensure local scores have a timestamp and are marked as local
    let localScores = (this.game.topScores || []).map(score => ({
      ...score,
      timestamp: score.timestamp || new Date(0).toISOString(),
      isLocal: true
    }));
    
    let fbScores = [];
    
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, SCORES_COLLECTION), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
        ]);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let ts = new Date(0).toISOString();
          if (data.timestamp) {
            if (typeof data.timestamp.toMillis === 'function') {
              ts = new Date(data.timestamp.toMillis()).toISOString();
            } else if (data.timestamp.seconds) {
              ts = new Date(data.timestamp.seconds * 1000).toISOString();
            } else {
              ts = new Date(data.timestamp).toISOString();
            }
          }
          fbScores.push({
            ...data,
            timestamp: ts,
            isFirebase: true
          });
        });
      } catch (e) {
        console.warn("Could not fetch scores from Firebase, falling back to local storage.", e.message);
      }
    }
    
    // Merge scores
    let allScores = [...localScores, ...fbScores];
    
    // Sort: Score DESC, then Timestamp ASC (older is better if tied)
    allScores.sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
    
    // Deduplicate by name and score to avoid showing the exact same run twice (once from local, once from FB)
    const uniqueScores = [];
    const seen = new Set();
    for (const score of allScores) {
      const key = `${score.name}_${score.score}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScores.push(score);
      } else {
        // If we already have this score, but the new one is from Firebase, we might want to mark the existing one as Firebase too
        const existing = uniqueScores.find(s => `${s.name}_${s.score}` === key);
        if (existing && score.isFirebase) {
          existing.isFirebase = true;
        }
      }
    }
    
    let scoresToDisplay = uniqueScores.slice(0, 50);
    
    if (loader) loader.classList.add('hidden');
    this.scoreListEl.classList.remove('hidden');
    
    this.scoreListEl.innerHTML = '';
    scoresToDisplay.forEach((entry, index) => {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.style.display = 'flex';
      nameSpan.style.alignItems = 'center';
      nameSpan.style.gap = '5px';
      
      const globeIcon = entry.isFirebase ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>` : '';
      
      nameSpan.innerHTML = `${index + 1}. ${entry.name || 'Anonymous'} ${globeIcon}`;
      
      const scoreSpan = document.createElement('span');
      scoreSpan.innerText = this.formatNumber(entry.score || 0);
      
      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);
      this.scoreListEl.appendChild(li);
    });
  }

  async saveScore() {
    const clientTimestamp = new Date().toISOString();
    
    this.game.topScores.push({ 
      name: this.game.playerName, 
      score: this.game.score,
      timestamp: clientTimestamp
    });
    this.game.topScores.sort((a, b) => b.score - a.score);
    this.game.topScores = this.game.topScores.slice(0, 10);
    localStorage.setItem('tower_topScores', JSON.stringify(this.game.topScores));
    
    if (isFirebaseEnabled) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("Utilisateur non authentifié");
        }
        await addDoc(collection(db, SCORES_COLLECTION), {
          name: String(this.game.playerName),
          score: Number(this.game.score),
          level: Number(this.game.level),
          balance: Math.floor(Number(this.game.currency)),
          elapsedTime: Number(this.game.time),
          userId: userId,
          timestamp: serverTimestamp(),
          client_timestamp: new Date().toISOString(),
          towerStats: {
            damage: Number(this.game.tower.damage),
            cooldown: Number(this.game.tower.cooldown),
            range: Number(this.game.tower.range),
            projectileSpeed: Number(this.game.tower.projectileSpeed),
            splashRadius: Number(this.game.tower.splashRadius),
            chainCount: Number(this.game.tower.chainCount),
            poisonDamage: Number(this.game.tower.poisonDamage)
          }
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
