import { Tower } from './Tower.js';
import { getLevelConfig, DIFFICULTY_LEVELS } from './Levels.js';
import { Shockwave } from './Shockwave.js';
import { TextEffect } from './TextEffect.js';
import { LightningEffect } from './LightningEffect.js';
import { SplashEffect } from './SplashEffect.js';
import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { LightningFeature } from './features/LightningFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';
import { SlowFeature } from './features/SlowFeature.js';
import { AudioManager } from './AudioManager.js';
import { UIManager } from './UIManager.js';
import { Renderer } from './Renderer.js';
import { NotificationManager } from './NotificationManager.js';
import { Simulator } from './Simulator.js';

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  LIFE_LOST: 'LIFE_LOST'
};

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GAME_STATES.MENU;
    this.score = 0;
    this.difficulty = localStorage.getItem('tower_difficulty') || 'MEDIUM';
    this.playerName = localStorage.getItem('tower_playerName') || '';
    this.topScores = JSON.parse(localStorage.getItem('tower_topScores')) || [];
    
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this);
    this.renderer = new Renderer(this, this.ctx);
    this.notificationManager = new NotificationManager(this);
    this.notificationManager.init();
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' && this.state === GAME_STATES.PLAYING) {
        this.updateState(GAME_STATES.PAUSED);
      }
    });
    
    this.uiManager.setup();
    this.uiManager.updateLeaderboard();
    
    this.reset();
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    
    window.runSimulation = (targetLevel) => Simulator.run(this, targetLevel);
    
    requestAnimationFrame(this.loop);
  }

  updateState(newState, options = {}) {
    if (this.state === newState && !options.force) return;
    this.state = newState;

    switch (newState) {
      case GAME_STATES.MENU:
        this.uiManager.showModal('mainMenu');
        this.audioManager.playMenuMusic();
        this.uiManager.updateMenuSoundBtn();
        this.uiManager.updateLeaderboard();
        break;
      case GAME_STATES.PLAYING:
        this.uiManager.closeAllModals();
        this.audioManager.stopMenuMusic();
        this.lastTime = performance.now();
        break;
      case GAME_STATES.PAUSED:
        if (options.showHelp) {
          this.uiManager.showModal('help');
        } else {
          this.uiManager.showModal('pause');
        }
        break;
      case GAME_STATES.GAME_OVER:
        this.uiManager.saveScore();
        this.uiManager.showGameOver();
        break;
      case GAME_STATES.LIFE_LOST:
        this.uiManager.showModal('lifeLost');
        break;
    }
  }

  
  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    if (this.tower) {
      this.tower.x = this.width / 2;
      this.tower.y = this.height / 2;
    }
    this.pauseBox = { x: this.width - 50, y: 20, w: 30, h: 30 };
    this.soundBox = { x: this.width - 90, y: 20, w: 30, h: 30 };
    if (this.upgrades) {
      let maxBoxSize = 50;
      let gap = 10;
      let availableWidth = this.width - 20;
      let totalNeeded = this.upgrades.length * (maxBoxSize + gap) - gap;
      
      let boxSize = maxBoxSize;
      if (totalNeeded > availableWidth) {
        gap = 5;
        boxSize = (availableWidth - (this.upgrades.length - 1) * gap) / this.upgrades.length;
      }
      
      let totalWidth = this.upgrades.length * (boxSize + gap) - gap;
      let startX = this.width / 2 - totalWidth / 2;
      
      this.upgrades.forEach((upg, i) => {
        upg.box = { x: startX + i * (boxSize + gap), y: this.height - boxSize - 30, w: boxSize, h: boxSize };
      });
    }
  }

  reset() {
    this.tower = new Tower(this.width / 2, this.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.shockwaves = [];
    this.textEffects = [];
    this.lightningEffects = [];
    this.splashEffects = [];
    this.flashes = [];
    this.currency = 0;
    this.score = 0;
    this.level = 1;
    this.currentWave = 0;
    this.totalWaves = 0;
    this.lives = 3;
    this.time = 0;
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000;
    this.levelStartCurrency = 0;
    this.levelStartScore = 0;
    this.levelSnapshot = null;
    this.history = []; // For control stats
    
    this.upgrades = [
      new DamageFeature(),
      new CooldownFeature(),
      new SpeedFeature(),
      new RangeFeature(),
      new SplashFeature(),
      new LightningFeature(),
      new PoisonFeature(),
      new SlowFeature()
    ];
    
    this.startLevel();
    this.resize();
  }

  startLevel(isRetry = false) {
    const config = getLevelConfig(this.level, this.difficulty);
    
    if (!isRetry) {
      this.currency += config.bonusCurrency || 0;
      this.levelStartCurrency = this.currency;
      this.levelStartScore = this.score;
      this.levelSnapshot = this.getSnapshot();
      this.history.push({ level: this.level, snapshot: this.levelSnapshot });
    }
    this.levelEvents = config.events;
    this.totalWaves = config.totalWaves || 0;
    this.currentWave = 0;
    this.levelStartTime = this.time;
    this.currentEventIndex = 0;
    
    this.spawnTextEffect(this.width / 2, this.height / 2 - 100, isRetry ? `RETRY LEVEL ${this.level}` : `LEVEL ${this.level}`, '#0df', 48, 2.5);
    if (this.level > 1 && !isRetry) {
      this.audioManager.playLevelUp();
    }
    if (config.bonusCurrency > 0 && !isRetry) {
      this.spawnTextEffect(this.width / 2, this.height / 2 - 40, `+${this.uiManager.formatNumber(config.bonusCurrency)} Bonus!`, '#fd0', 32, 2.5);
    }
  }

  loseLife() {
    if (this.state !== GAME_STATES.PLAYING) return;
    
    this.lives--;
    this.audioManager.playSound('lifeLost');
    this.spawnFlash('#f00', 0.3);
    this.spawnShockwave(this.width / 2, this.height / 2, '#f00', 100, 0.5, null, 20);
    
    if (this.lives <= 0) {
      this.audioManager.playSound('gameover');
      this.updateState(GAME_STATES.GAME_OVER);
    } else {
      this.updateState(GAME_STATES.LIFE_LOST);
    }
  }

  retryLevel() {
    // Restore from snapshot to reset upgrades/stats to level start
    if (this.levelSnapshot) {
      this.restoreSnapshot(this.levelSnapshot);
    }
    
    // Reset current level state
    this.enemies = [];
    this.projectiles = [];
    this.shockwaves = [];
    this.textEffects = [];
    this.lightningEffects = [];
    this.splashEffects = [];
    this.flashes = [];
    
    this.updateState(GAME_STATES.PLAYING);
    this.startLevel(true);
  }

  getSnapshot() {
    return {
      currency: this.currency,
      score: this.score,
      lives: this.lives,
      level: this.level,
      tower: {
        damage: this.tower.damage,
        range: this.tower.range,
        cooldown: this.tower.cooldown,
        projectileSpeed: this.tower.projectileSpeed,
        splashRadius: this.tower.splashRadius || 0,
        lightningCount: this.tower.lightningCount || 0,
        lightningRange: this.tower.lightningRange || 0,
        poisonDamage: this.tower.poisonDamage || 0,
        poisonDuration: this.tower.poisonDuration || 0,
        slowIntensity: this.tower.slowIntensity || 0,
        slowDuration: this.tower.slowDuration || 0
      },
      upgrades: this.upgrades.map(upg => ({
        id: upg.id,
        level: upg.level,
        cost: upg.cost,
        intensity: upg.intensity
      }))
    };
  }

  restoreSnapshot(snapshot) {
    this.currency = snapshot.currency;
    this.score = snapshot.score;
    // We don't restore lives because losing a life is what triggered the retry
    // this.lives = snapshot.lives; 
    this.level = snapshot.level;
    
    // Restore tower
    this.tower.damage = snapshot.tower.damage;
    this.tower.range = snapshot.tower.range;
    this.tower.cooldown = snapshot.tower.cooldown;
    this.tower.projectileSpeed = snapshot.tower.projectileSpeed;
    this.tower.splashRadius = snapshot.tower.splashRadius;
    this.tower.lightningCount = snapshot.tower.lightningCount;
    this.tower.lightningRange = snapshot.tower.lightningRange;
    this.tower.poisonDamage = snapshot.tower.poisonDamage;
    this.tower.poisonDuration = snapshot.tower.poisonDuration;
    this.tower.slowIntensity = snapshot.tower.slowIntensity;
    this.tower.slowDuration = snapshot.tower.slowDuration;
    
    // Restore upgrades
    snapshot.upgrades.forEach(upgSnap => {
      const upg = this.upgrades.find(u => u.id === upgSnap.id);
      if (upg) {
        upg.level = upgSnap.level;
        upg.cost = upgSnap.cost;
        upg.intensity = upgSnap.intensity;
      }
    });
  }

  spawnShockwave(x, y, color, maxRadius = 30, duration = 0.3, target = null, maxAmplitude = 5, isPersistent = false) {
    this.shockwaves.push(new Shockwave(x, y, color, maxRadius, duration, target, maxAmplitude, isPersistent));
  }

  spawnFlash(color, duration) {
    this.flashes.push({ color, life: duration, maxLife: duration });
  }

  spawnTextEffect(x, y, text, color, size, duration) {
    this.textEffects.push(new TextEffect(x, y, text, color, size, duration));
  }

  spawnLightningEffect(x1, y1, x2, y2, color = '#0ff', duration = 0.2) {
    this.lightningEffects.push(new LightningEffect(x1, y1, x2, y2, color, duration));
  }

  spawnSplashEffect(x, y, color, radius, duration, intensity = 1.0) {
    this.splashEffects.push(new SplashEffect(x, y, color, radius, duration, intensity));
  }

  handleClick(e) {
    this.audioManager.init();
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (this.state === GAME_STATES.MENU || this.state === GAME_STATES.GAME_OVER || this.state === GAME_STATES.LIFE_LOST || this.state === GAME_STATES.PAUSED) {
      return;
    }

    if (this.state === GAME_STATES.PLAYING) {
      if (x >= this.soundBox.x && x <= this.soundBox.x + this.soundBox.w &&
          y >= this.soundBox.y && y <= this.soundBox.y + this.soundBox.h) {
        this.audioManager.toggleSound();
        return;
      }
      if (x >= this.pauseBox.x && x <= this.pauseBox.x + this.pauseBox.w &&
          y >= this.pauseBox.y && y <= this.pauseBox.y + this.pauseBox.h) {
        this.updateState(GAME_STATES.PAUSED);
        return;
      }

      for (let upg of this.upgrades) {
        if (x >= upg.box.x && x <= upg.box.x + upg.box.w &&
            y >= upg.box.y && y <= upg.box.y + upg.box.h) {
          upg.purchase(this.tower, this);
        }
      }
    }
  }

  spawnEnemy(EnemyClass, isBoss = false) {
    if (!EnemyClass) return;
    
    this.spawnAngle = (this.spawnAngle || 0) + Math.PI * 0.37;
    
    const cos = Math.cos(this.spawnAngle);
    const sin = Math.sin(this.spawnAngle);
    
    // Calculate distance to the screen edge (plus a 50px buffer)
    const distX = Math.abs((this.width / 2 + 50) / (cos === 0 ? 0.0001 : cos));
    const distY = Math.abs((this.height / 2 + 50) / (sin === 0 ? 0.0001 : sin));
    const dist = Math.min(distX, distY);
    
    let ex = this.width / 2 + cos * dist;
    let ey = this.height / 2 + sin * dist;
    let tx = this.width / 2;
    let ty = this.height / 2;
    
    const enemy = new EnemyClass({ x: ex, y: ey, targetX: tx, targetY: ty, isBoss });
    enemy.applyDifficulty(DIFFICULTY_LEVELS[this.difficulty], this.level);
    this.enemies.push(enemy);
  }

  update(dt) {
    this.time += dt * 1000;
    
    let levelTime = this.time - this.levelStartTime;
    
    while (this.currentEventIndex < this.levelEvents.length && 
           levelTime >= this.levelEvents[this.currentEventIndex].time) {
      const event = this.levelEvents[this.currentEventIndex];
      this.currentWave = event.wave;
      this.spawnEnemy(event.type, event.isBoss);
      this.currentEventIndex++;
    }
    
    if (this.currentEventIndex >= this.levelEvents.length && this.enemies.length === 0) {
      this.level++;
      this.startLevel();
    }
    
    this.tower.update(dt, this);
    this.enemies.forEach(e => e.update(dt, this));
    this.projectiles.forEach(p => p.update(dt, this));
    this.shockwaves.forEach(s => s.update(dt));
    this.textEffects.forEach(t => t.update(dt));
    this.lightningEffects.forEach(c => c.update(dt));
    this.splashEffects.forEach(s => s.update(dt));
    this.flashes.forEach(f => f.life -= dt);
    
    this.enemies = this.enemies.filter(e => !e.markedForDeletion);
    this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
    this.shockwaves = this.shockwaves.filter(s => !s.markedForDeletion);
    this.textEffects = this.textEffects.filter(t => !t.markedForDeletion);
    this.lightningEffects = this.lightningEffects.filter(c => !c.markedForDeletion);
    this.splashEffects = this.splashEffects.filter(s => !s.markedForDeletion);
    this.flashes = this.flashes.filter(f => f.life > 0);
  }

  loop(timestamp) {
    if (this.isHeadless) return;

    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    if (this.state === GAME_STATES.PLAYING) {
      this.update(dt);
    }
    
    this.renderer.draw();
    
    requestAnimationFrame(this.loop);
  }
}
