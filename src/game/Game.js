import { Tower } from './Tower.js';
import { getLevelConfig } from './Levels.js';
import { Shockwave } from './Shockwave.js';
import { TextEffect } from './TextEffect.js';
import { ChainEffect } from './ChainEffect.js';
import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { ChainFeature } from './features/ChainFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';
import { AudioManager } from './AudioManager.js';
import { UIManager } from './UIManager.js';
import { Renderer } from './Renderer.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'MENU';
    this.score = 0;
    this.playerName = localStorage.getItem('tower_playerName') || '';
    this.topScores = JSON.parse(localStorage.getItem('tower_topScores')) || [];
    
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this);
    this.renderer = new Renderer(this, this.ctx);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' && this.state === 'PLAYING') {
        this.state = 'PAUSED';
      }
    });
    
    this.uiManager.setup();
    this.uiManager.updateLeaderboard();
    
    this.reset();
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
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
    this.helpBox = { x: this.width - 130, y: 20, w: 30, h: 30 };
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
    this.chainEffects = [];
    this.flashes = [];
    this.currency = 0;
    this.score = 0;
    this.level = 1;
    this.time = 0;
    this.lastSpawnTime = 0;
    this.spawnInterval = 2000;
    this.startLevel();
    
    this.upgrades = [
      new DamageFeature(),
      new CooldownFeature(),
      new SpeedFeature(),
      new RangeFeature(),
      new SplashFeature(),
      new ChainFeature(),
      new PoisonFeature()
    ];
    this.resize();
  }

  startLevel() {
    const config = getLevelConfig(this.level);
    
    this.currency += config.bonusCurrency || 0;
    this.levelEvents = config.events;
    this.levelStartTime = this.time;
    this.currentEventIndex = 0;
    
    this.spawnTextEffect(this.width / 2, this.height / 2 - 100, `LEVEL ${this.level}`, '#0df', 64, 2.5);
    if (config.bonusCurrency > 0) {
      this.spawnTextEffect(this.width / 2, this.height / 2 - 40, `+${this.uiManager.formatNumber(config.bonusCurrency)} Bonus!`, '#fd0', 32, 2.5);
    }
  }

  gameOver() {
    this.state = 'GAME_OVER';
    this.uiManager.saveScore();
    this.uiManager.showGameOver();
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

  spawnChainEffect(x1, y1, x2, y2, color = '#0ff', duration = 0.2) {
    this.chainEffects.push(new ChainEffect(x1, y1, x2, y2, color, duration));
  }

  handleClick(e) {
    this.audioManager.init();
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (this.state === 'MENU' || this.state === 'GAME_OVER') {
      return;
    }

    if (this.state === 'PAUSED') {
      let cx = this.width / 2;
      let cy = this.height / 2;
      
      if (x >= cx - 100 && x <= cx + 100 && y >= cy - 90 && y <= cy - 50) {
        this.state = 'PLAYING';
        this.lastTime = performance.now();
      }
      else if (x >= cx - 100 && x <= cx + 100 && y >= cy - 30 && y <= cy + 10) {
        this.reset();
        this.state = 'PLAYING';
        this.lastTime = performance.now();
      }
      else if (x >= cx - 100 && x <= cx + 100 && y >= cy + 30 && y <= cy + 70) {
        this.uiManager.toggleFullscreen();
      }
      else if (x >= cx - 100 && x <= cx + 100 && y >= cy + 90 && y <= cy + 130) {
        this.state = 'MENU';
        if (this.uiManager.mainMenuEl) {
          this.uiManager.mainMenuEl.classList.remove('hidden');
        }
      }
      return;
    }

    if (this.state === 'PLAYING') {
      if (x >= this.soundBox.x && x <= this.soundBox.x + this.soundBox.w &&
          y >= this.soundBox.y && y <= this.soundBox.y + this.soundBox.h) {
        this.audioManager.toggleSound();
        return;
      }
      if (x >= this.pauseBox.x && x <= this.pauseBox.x + this.pauseBox.w &&
          y >= this.pauseBox.y && y <= this.pauseBox.y + this.pauseBox.h) {
        this.state = 'PAUSED';
        return;
      }
      if (x >= this.helpBox.x && x <= this.helpBox.x + this.helpBox.w &&
          y >= this.helpBox.y && y <= this.helpBox.y + this.helpBox.h) {
        this.state = 'PAUSED';
        const helpModal = document.getElementById('help-modal');
        if (helpModal) helpModal.classList.remove('hidden');
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

  spawnEnemy(EnemyClass) {
    this.spawnAngle = (this.spawnAngle || 0) + Math.PI * 0.37;
    let dist = Math.max(this.width, this.height);
    let ex = this.width / 2 + Math.cos(this.spawnAngle) * dist;
    let ey = this.height / 2 + Math.sin(this.spawnAngle) * dist;
    let tx = this.width / 2;
    let ty = this.height / 2;
    
    this.enemies.push(new EnemyClass({ x: ex, y: ey, targetX: tx, targetY: ty }));
  }

  loop(timestamp) {
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    if (this.state === 'PLAYING') {
      this.time += dt * 1000;
      
      let levelTime = this.time - this.levelStartTime;
      
      while (this.currentEventIndex < this.levelEvents.length && 
             levelTime >= this.levelEvents[this.currentEventIndex].time) {
        this.spawnEnemy(this.levelEvents[this.currentEventIndex].type);
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
      this.chainEffects.forEach(c => c.update(dt));
      this.flashes.forEach(f => f.life -= dt);
      
      this.enemies = this.enemies.filter(e => !e.markedForDeletion);
      this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
      this.shockwaves = this.shockwaves.filter(s => !s.markedForDeletion);
      this.textEffects = this.textEffects.filter(t => !t.markedForDeletion);
      this.chainEffects = this.chainEffects.filter(c => !c.markedForDeletion);
      this.flashes = this.flashes.filter(f => f.life > 0);
    }
    
    this.renderer.draw();
    
    requestAnimationFrame(this.loop);
  }
}
