import { auth, provider, signInWithPopup, onAuthStateChanged, isFirebaseEnabled } from '../services/firebase.js';
import { IconRenderer } from './IconRenderer.js';
import { LeaderboardManager } from './LeaderboardManager.js';
import { ModalManager } from './ModalManager.js';
import { GAME_STATES } from './GameStates.js';

const DEFAULT_USERNAME = 'Anonymous';

export class UIManager {
  constructor(game) {
    this.game = game;
    console.log('UIManager constructor running, looking for buttons…');
    this.formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    this.modalManager = new ModalManager();
    this.playerNameInput = document.getElementById('playerName');
    this.difficultySelect = document.getElementById('difficultySelect');
    
    this.leaderboardManager = new LeaderboardManager(this.game, this);

    this.loginBtn = document.getElementById('loginBtn');
    this.userInfo = document.getElementById('userInfo');
    this.authSection = document.getElementById('auth-section');

    const storedName = localStorage.getItem('tower_playerName');
    this.game.playerName = storedName ? storedName : DEFAULT_USERNAME;

    if (this.playerNameInput) {
      this.playerNameInput.value = this.game.playerName;
    }

    if (this.difficultySelect) {
      this.difficultySelect.value = this.game.difficulty;
    }
  }

  showModal(modalName) {
    this.modalManager.showModal(modalName);
  }

  closeAllModals() {
    this.modalManager.closeAllModals();
  }

  setup() {
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim() || DEFAULT_USERNAME;
        this.game.playerName = val;
        localStorage.setItem('tower_playerName', val);
      });
    }

    if (this.difficultySelect) {
      this.difficultySelect.addEventListener('change', (e) => {
        const val = e.target.value;
        this.game.difficulty = val;
        localStorage.setItem('tower_difficulty', val);
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
        this.game.audioManager.init();
        this.game.notificationManager.requestPermission();
        this.game.reset();
        this.game.updateState(GAME_STATES.PLAYING);
      });
    } else console.warn('startBtn not found');

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.game.reset();
        this.game.updateState(GAME_STATES.PLAYING);
      });
    } else console.warn('restartBtn not found');

    const mainMenuBtn = document.getElementById('mainMenuBtn');
    if (mainMenuBtn) {
      mainMenuBtn.addEventListener('click', () => {
        this.game.updateState(GAME_STATES.MENU);
      });
    } else console.warn('mainMenuBtn not found');

    const retryLevelBtn = document.getElementById('retryLevelBtn');
    if (retryLevelBtn) {
      retryLevelBtn.addEventListener('click', () => {
        this.game.retryLevel();
      });
    }

    const mainMenuFromLifeLostBtn = document.getElementById('mainMenuFromLifeLostBtn');
    if (mainMenuFromLifeLostBtn) {
      mainMenuFromLifeLostBtn.addEventListener('click', () => {
        this.game.updateState(GAME_STATES.MENU);
      });
    }

    const helpModal = document.getElementById('help-modal');
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showModal('help');
      });
    } else console.warn('helpBtn not found');

    const closeHelpBtn = document.getElementById('closeHelpBtn');
    if (closeHelpBtn) {
      closeHelpBtn.addEventListener('click', () => {
        if (this.game.state === GAME_STATES.MENU) {
          this.showModal('mainMenu');
        } else if (this.game.state === GAME_STATES.PAUSED) {
          this.showModal('pause');
        } else {
          this.closeAllModals();
        }
      });
    } else console.warn('closeHelpBtn not found');

    // Pause menu buttons
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.game.updateState(GAME_STATES.PLAYING);
      });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.game.reset();
        this.game.updateState(GAME_STATES.PLAYING);
      });
    }

    const pauseFullscreenBtn = document.getElementById('pauseFullscreenBtn');
    if (pauseFullscreenBtn) {
      pauseFullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        this.game.updateState(GAME_STATES.MENU);
      });
    }

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

    const menuSoundBtn = document.getElementById('menuSoundBtn');
    if (menuSoundBtn) {
      menuSoundBtn.addEventListener('click', () => {
        this.game.audioManager.init();
        const enabled = this.game.audioManager.toggleSound();
        if (enabled) {
          menuSoundBtn.innerText = '🔊';
          menuSoundBtn.style.color = '#0f0';
          menuSoundBtn.style.borderColor = '#0f0';
          this.game.audioManager.playMenuMusic();
        } else {
          menuSoundBtn.innerText = '🔇';
          menuSoundBtn.style.color = '#f00';
          menuSoundBtn.style.borderColor = '#f00';
        }
      });
    }

    IconRenderer.renderTowerFeatureIcons();
    this.updateMenuSoundBtn();
    
    // Show main menu initially
    if (this.game.state === GAME_STATES.MENU) {
      this.showModal('mainMenu');
    }
  }

  updateMenuSoundBtn() {
    const menuSoundBtn = document.getElementById('menuSoundBtn');
    if (menuSoundBtn) {
      if (this.game.audioManager.soundEnabled) {
        menuSoundBtn.innerText = '🔊';
        menuSoundBtn.style.color = '#0f0';
        menuSoundBtn.style.borderColor = '#0f0';
      } else {
        menuSoundBtn.innerText = '🔇';
        menuSoundBtn.style.color = '#f00';
        menuSoundBtn.style.borderColor = '#f00';
      }
    }
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

  updateLeaderboard() {
    this.leaderboardManager.updateLeaderboard();
  }

  saveScore() {
    this.leaderboardManager.saveScore();
  }

  showGameOver() {
    const finalScoreEl = document.getElementById('finalScore');
    if (finalScoreEl) finalScoreEl.innerText = `Score: ${this.formatNumber(this.game.score)}`;
    const finalLevelEl = document.getElementById('finalLevel');
    if (finalLevelEl) finalLevelEl.innerText = `Level: ${this.game.level}`;
    this.showModal('gameOver');
  }
}