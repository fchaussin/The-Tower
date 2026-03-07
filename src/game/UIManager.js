import { auth, provider, signInWithPopup, onAuthStateChanged, signOut, isFirebaseEnabled } from '../services/firebase.js';
import { Help } from './Help.js';
import { LeaderboardManager } from './LeaderboardManager.js';
import { ModalManager } from './ModalManager.js';
import { GAME_STATES } from './Game.js';

const DEFAULT_USERNAME = 'Anonymous';

export class UIManager {
  constructor(game) {
    this.game = game;
    console.log('UIManager constructor running, looking for buttons…');
    this.formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    this.modalManager = new ModalManager();
    this.help = new Help();
    this.playerNameInput = document.getElementById('playerName');
    this.difficultySelect = document.getElementById('difficultySelect');
    
    this.leaderboardManager = new LeaderboardManager(this.game, this);

    this.loginBtn = document.getElementById('loginBtn');
    this.logoutBtn = document.getElementById('logoutBtn');
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

  showConfirm(title, message, onYes, onNo) {
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    const yesBtn = document.getElementById('confirmYesBtn');
    const noBtn = document.getElementById('confirmNoBtn');

    if (titleEl) titleEl.innerText = title;
    if (messageEl) messageEl.innerText = message;

    const cleanup = () => {
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
    };

    const handleYes = () => {
      cleanup();
      if (onYes) onYes();
    };

    const handleNo = () => {
      cleanup();
      if (onNo) onNo();
    };

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);

    this.showModal('confirm');
  }

  showModal(modalName) {
    this.modalManager.showModal(modalName);
  }

  closeAllModals() {
    this.modalManager.closeAllModals();
  }

  setupButton(id, onClick) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', onClick);
    } else {
      console.warn(`${id} not found`);
    }
    return btn;
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
          if (this.logoutBtn) this.logoutBtn.classList.remove('hidden');
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
          if (this.logoutBtn) this.logoutBtn.classList.add('hidden');
          if (this.userInfo) {
            this.userInfo.innerText = `Let's authenticate for global topscores !`;
          }
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

      if (this.logoutBtn) {
        this.logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await signOut(auth);
          } catch (error) {
            console.error("Logout failed", error);
          }
        });
      }
    }

    this.setupButton('startBtn', () => {
      this.game.audioManager.init();
      this.game.notificationManager.requestPermission();
      this.game.reset();
      this.game.updateState(GAME_STATES.PLAYING);
    });

    this.setupButton('restartBtn', () => {
      this.game.reset();
      this.game.updateState(GAME_STATES.PLAYING);
    });

    this.setupButton('mainMenuBtn', () => {
      this.game.updateState(GAME_STATES.MENU);
    });

    this.setupButton('retryLevelBtn', () => {
      this.game.retryLevel();
    });

    this.setupButton('mainMenuFromLifeLostBtn', () => {
      this.game.updateState(GAME_STATES.MENU);
    });

    this.setupButton('helpBtn', () => {
      this.showModal('help');
    });

    document.addEventListener('fullscreenchange', () => {
      const modalName = this.modalManager.currentModal;
      if (modalName) {
        // Re-open the modal to ensure it's in the top layer of the current fullscreen state
        this.modalManager.showModal(modalName);
      }
    });

    this.setupButton('closeHelpBtn', () => {
      if (this.game.state === GAME_STATES.MENU) {
        this.showModal('mainMenu');
      } else if (this.game.state === GAME_STATES.PAUSED) {
        this.showModal('pause');
      } else {
        this.closeAllModals();
      }
    });

    // Pause menu buttons
    this.setupButton('resumeBtn', () => {
      this.game.updateState(GAME_STATES.PLAYING);
    });

    this.setupButton('resetBtn', () => {
      this.game.reset();
      this.game.updateState(GAME_STATES.PLAYING);
    });

    this.setupButton('pauseFullscreenBtn', () => {
      this.toggleFullscreen();
    });

    this.setupButton('exitBtn', () => {
      this.game.updateState(GAME_STATES.MENU);
    });

    const fullscreenBtn = this.setupButton('fullscreenBtn', () => {
      this.toggleFullscreen();
    });
    
    if (fullscreenBtn) {
      document.addEventListener('fullscreenchange', () => {
        fullscreenBtn.innerText = !document.fullscreenElement ? 'ENTER FULLSCREEN' : 'EXIT FULLSCREEN';
      });
    }

    this.setupButton('menuSoundBtn', () => {
      this.game.audioManager.init();
      const enabled = this.game.audioManager.toggleSound();
      if (enabled) {
        this.game.audioManager.playMenuMusic();
      }
      this.updateMenuSoundBtn();
    });

    this.help.init();
    this.updateMenuSoundBtn();
    
    // Handle browser back button robustly using a hash trap
    const trapHash = '#game';
    const pushTrap = () => {
      if (window.location.hash !== trapHash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search + trapHash);
      }
    };
    
    pushTrap();

    this.popstateHandler = (e) => {
      if (window.location.hash !== trapHash) {
        pushTrap(); // Re-trap immediately

        const state = this.game.state;
        const currentModal = this.modalManager.currentModal;

        if (state === GAME_STATES.MENU && currentModal === 'mainMenu') {
          this.showConfirm("QUIT GAME", "Are you sure you want to quit the game?", () => {
            window.removeEventListener('popstate', this.popstateHandler);
            window.history.go(-2);
          }, () => {
            this.showModal('mainMenu');
          });
        } else if (state === GAME_STATES.PLAYING) {
          this.game.updateState(GAME_STATES.PAUSED);
          setTimeout(() => {
            this.showConfirm("MAIN MENU", "Are you sure you want to return to the main menu?", () => {
              this.game.updateState(GAME_STATES.MENU, { force: true });
            }, () => {
              this.game.updateState(GAME_STATES.PLAYING);
            });
          }, 10);
        } else if (state === GAME_STATES.PAUSED && currentModal === 'pause') {
          setTimeout(() => {
            this.showConfirm("MAIN MENU", "Are you sure you want to return to the main menu?", () => {
              this.game.updateState(GAME_STATES.MENU, { force: true });
            }, () => {
              this.showModal('pause');
            });
          }, 10);
        } else if (currentModal === 'help') {
          if (state === GAME_STATES.MENU) {
            this.showModal('mainMenu');
          } else if (state === GAME_STATES.PAUSED) {
            this.showModal('pause');
          }
        }
      }
    };
    window.addEventListener('popstate', this.popstateHandler);

    // Show main menu initially
    if (this.game.state === GAME_STATES.MENU) {
      this.showModal('mainMenu');
    }
  }

  updateMenuSoundBtn() {
    const menuSoundBtn = document.getElementById('menuSoundBtn');
    if (menuSoundBtn) {
      const enabled = this.game.audioManager.soundEnabled;
      menuSoundBtn.innerText = enabled ? '🎵' : '🙉';
      menuSoundBtn.style.color = enabled ? '#0f0' : '#f00';
      menuSoundBtn.style.borderColor = enabled ? '#0f0' : '#f00';
    }
  }

  toggleFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
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