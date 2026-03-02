import { auth, db, provider, signInWithPopup, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy, limit, isFirebaseEnabled, SCORES_COLLECTION, LEADERBOARD_COLLECTION, writeBatch, doc, serverTimestamp } from '../services/firebase.js';
import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { ChainFeature } from './features/ChainFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';

const ICON_GLOBAL = `<svg class="global" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
const ICON_LOCAL = `<svg class="local" width="10" height="10" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><polygon fill="none" stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="31,16 31,19 27,19 27,31 21,31 21,19 11,19 11,31 5,31 5,19 1,19 1,16 16,1 21,6 21,1 27,1 27,12"/></svg>`;
const DEFAULT_USERNAME = 'Anonymous';

export class UIManager {
  constructor(game) {
    this.game = game;
    console.log('UIManager constructor running, looking for buttons…');
    this.formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    this.mainMenuEl = document.getElementById('main-menu');
    this.gameOverMenuEl = document.getElementById('game-over-menu');
    this.playerNameInput = document.getElementById('playerName');
    this.scoreListEl = document.getElementById('scoreList');

    this.loginBtn = document.getElementById('loginBtn');
    this.userInfo = document.getElementById('userInfo');
    this.authSection = document.getElementById('auth-section');

    const storedName = localStorage.getItem('tower_playerName');
    this.game.playerName = storedName ? storedName : DEFAULT_USERNAME;

    if (this.playerNameInput) {
      this.playerNameInput.value = this.game.playerName;
    }
  }

  setup() {
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || DEFAULT_USERNAME;
        this.game.playerName = val;
        localStorage.setItem('tower_playerName', val);
      });
    }

    if (isFirebaseEnabled && this.authSection) {
      this.authSection.classList.remove('hidden');

      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (this.loginBtn) this.loginBtn.classList.add('hidden');
          if (this.userInfo) {
            this.userInfo.innerText = `Logged in as: ${user.displayName}`;
          }

          if (this.game.playerName === DEFAULT_USERNAME) {
            const username = user.displayName;
            if (this.playerNameInput) this.playerNameInput.value = username;
            this.game.playerName = username;
            localStorage.setItem('tower_playerName', username);
          }
        } else {
          if (this.loginBtn) this.loginBtn.classList.remove('hidden');
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
        this.updateLeaderboard();
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

  renderIcon(canvas, feature) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = feature.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    feature.draw(ctx, 0, 0, canvas.width, canvas.height, feature.color);
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
      const canvas = document.getElementById(id);
      if (canvas) {
        this.renderIcon(canvas, feature);
      }
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

    let localScores = (this.game.topScores || []).map(score => ({
      ...score,
      timestampMs: new Date(score.timestamp || 0).getTime(),
      isLocal: true
    }));
    let fbScores = [];
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, LEADERBOARD_COLLECTION), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
        ]);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let tsMs = 0;
          if (data.timestamp) {
            if (typeof data.timestamp.toMillis === 'function') {
              tsMs = data.timestamp.toMillis();
            } else if (data.timestamp.seconds) {
              tsMs = data.timestamp.seconds * 1000;
            } else {
              tsMs = new Date(data.timestamp).getTime();
            }
          }
          fbScores.push({
            ...data,
            timestampMs: tsMs,
            isFirebase: true
          });
        });
      } catch (e) {
        console.warn("Could not fetch scores from Firebase, falling back to local storage.", e.message);
      }
    }

    let allScores = [...localScores, ...fbScores];
    allScores.sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return a.timestampMs - b.timestampMs;
    });

    const uniqueScores = [];
    const seen = new Set();
    for (const score of allScores) {
      const key = `${score.name}_${score.score}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScores.push(score);
      } else {
        const existing = uniqueScores.find(s => `${s.name}_${s.score}` === key);
        if (existing && score.isFirebase) {
          existing.isFirebase = true;
        }
      }
    }

    let scoresToDisplay = uniqueScores.slice(0, 50);
    if (loader) loader.classList.add('hidden');
    this.scoreListEl.classList.remove('hidden');
    let htmlStr = '';
    scoresToDisplay.forEach((entry, index) => {
      const globeIcon = entry.isFirebase ? ICON_GLOBAL : ICON_LOCAL;
      htmlStr += `<li>
        <span style="display: flex; align-items: center; gap: 5px;">
          ${index + 1}. ${globeIcon} ${entry.name || DEFAULT_USERNAME}
        </span>
        <span>${this.formatNumber(entry.score || 0)}</span>
      </li>`;
    });

    this.scoreListEl.innerHTML = htmlStr;
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
        if (!userId) throw new Error("Utilisateur non authentifié");
        const batch = writeBatch(db);
        const scoreRef = doc(collection(db, SCORES_COLLECTION));
        const scoreId = scoreRef.id;
        const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, scoreId);
        const name = String(this.game.playerName);
        const score = Number(this.game.score);
        const ts = serverTimestamp();

        batch.set(scoreRef, {
          name: name,
          score: score,
          level: Number(this.game.level),
          balance: Math.floor(Number(this.game.currency)),
          elapsedTime: Number(this.game.time),
          userId: userId,
          timestamp: ts,
          client_timestamp: clientTimestamp,
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

        batch.set(leaderboardRef, {
          name: name,
          score: score,
          timestamp: ts
        });

        await batch.commit();

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