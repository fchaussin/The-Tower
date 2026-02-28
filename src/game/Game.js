import { Tower } from './Tower.js';
import { getLevelConfig } from './Levels.js';
import { Shockwave } from './Shockwave.js';
import { TextEffect } from './TextEffect.js';
import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { ChainFeature } from './features/ChainFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';
import { auth, db, provider, signInWithPopup, onAuthStateChanged, collection, addDoc, getDocs, query, orderBy, limit, isFirebaseEnabled } from '../services/firebase.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'MENU';
    this.score = 0;
    this.soundEnabled = false;
    this.audioCtx = null;
    this.playerName = localStorage.getItem('tower_playerName') || '';
    this.topScores = JSON.parse(localStorage.getItem('tower_topScores')) || [];
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    this.setupUI();
    this.updateLeaderboard();
    
    this.reset();
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }
  
  setupUI() {
    this.mainMenuEl = document.getElementById('main-menu');
    this.gameOverMenuEl = document.getElementById('game-over-menu');
    this.playerNameInput = document.getElementById('playerName');
    this.scoreListEl = document.getElementById('scoreList');
    
    this.loginBtn = document.getElementById('loginBtn');
    this.userInfo = document.getElementById('userInfo');
    this.authSection = document.getElementById('auth-section');
    
    this.playerNameInput.value = this.playerName;
    
    if (isFirebaseEnabled && this.authSection) {
      this.authSection.classList.remove('hidden');
      
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.loginBtn.classList.add('hidden');
          this.userInfo.classList.remove('hidden');
          this.userInfo.innerText = `Logged in as: ${user.email}`;
          
          // Extract username before @
          const username = user.email.split('@')[0];
          this.playerNameInput.value = username;
          this.playerName = username;
          localStorage.setItem('tower_playerName', this.playerName);
        } else {
          this.loginBtn.classList.remove('hidden');
          this.userInfo.classList.add('hidden');
        }
      });
      
      this.loginBtn.addEventListener('click', async () => {
        try {
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error("Login failed", error);
        }
      });
    }
    
    document.getElementById('startBtn').addEventListener('click', () => {
      this.playerName = this.playerNameInput.value.trim() || 'Anonymous';
      localStorage.setItem('tower_playerName', this.playerName);
      this.mainMenuEl.classList.add('hidden');
      this.initAudio();
      this.reset();
      this.state = 'PLAYING';
      this.lastTime = performance.now();
    });
    
    document.getElementById('restartBtn').addEventListener('click', () => {
      this.gameOverMenuEl.classList.add('hidden');
      this.reset();
      this.state = 'PLAYING';
      this.lastTime = performance.now();
    });
  }
  
  formatNumber(num) {
    if (!this.formatter) {
      this.formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
    }
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
    
    let scoresToDisplay = this.topScores; // Fallback to local storage
    
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const fbScores = [];
        querySnapshot.forEach((doc) => {
          fbScores.push(doc.data());
        });
        if (fbScores.length > 0) {
          scoresToDisplay = fbScores;
        }
      } catch (e) {
        console.error("Error fetching scores from Firebase, falling back to local", e);
      }
    }
    
    this.scoreListEl.innerHTML = '';
    scoresToDisplay.forEach((entry, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${this.formatNumber(entry.score)}</span>`;
      this.scoreListEl.appendChild(li);
    });
  }
  
  async saveScore() {
    // Always save locally as fallback/offline
    this.topScores.push({ name: this.playerName, score: this.score });
    this.topScores.sort((a, b) => b.score - a.score);
    this.topScores = this.topScores.slice(0, 10); // Keep top 10
    localStorage.setItem('tower_topScores', JSON.stringify(this.topScores));
    
    if (isFirebaseEnabled) {
      try {
        await addDoc(collection(db, 'scores'), {
          name: this.playerName,
          score: this.score,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error("Error saving score to Firebase", e);
      }
    }
    
    this.updateLeaderboard();
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
      let availableWidth = this.width - 20; // 10px padding on each side
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
      this.spawnTextEffect(this.width / 2, this.height / 2 - 40, `+${this.formatNumber(config.bonusCurrency)} Bonus!`, '#fd0', 32, 2.5);
    }
  }
  gameOver() {
    this.state = 'GAME_OVER';
    this.saveScore();
    document.getElementById('finalScore').innerText = `Score: ${this.formatNumber(this.score)}`;
    document.getElementById('finalLevel').innerText = `Level: ${this.level}`;
    this.gameOverMenuEl.classList.remove('hidden');
  }
  spawnShockwave(x, y, color, maxRadius = 30, duration = 0.3, target = null, maxAmplitude = 5) {
    this.shockwaves.push(new Shockwave(x, y, color, maxRadius, duration, target, maxAmplitude));
  }
  spawnFlash(color, duration) {
    this.flashes.push({ color, life: duration, maxLife: duration });
  }
  spawnTextEffect(x, y, text, color, size, duration) {
    this.textEffects.push(new TextEffect(x, y, text, color, size, duration));
  }
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    if (type === 'shoot') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
      if (navigator.vibrate) navigator.vibrate(10);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
      if (navigator.vibrate) navigator.vibrate(15);
    } else if (type === 'gameover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.start(now); osc.stop(now + 1.5);
      if (navigator.vibrate) navigator.vibrate([200, 100, 300]);
    }
  }
  handleClick(e) {
    this.initAudio();
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (this.state === 'MENU' || this.state === 'GAME_OVER') {
      return; // Handled by HTML UI
    }

    if (this.state === 'PAUSED') {
      let cx = this.width / 2;
      let cy = this.height / 2;
      
      if (x >= cx - 100 && x <= cx + 100 && y >= cy - 60 && y <= cy - 20) {
        this.state = 'PLAYING';
        this.lastTime = performance.now();
      }
      else if (x >= cx - 100 && x <= cx + 100 && y >= cy && y <= cy + 40) {
        this.reset();
        this.state = 'PLAYING';
        this.lastTime = performance.now();
      }
      else if (x >= cx - 100 && x <= cx + 100 && y >= cy + 60 && y <= cy + 100) {
        this.state = 'MENU';
        this.mainMenuEl.classList.remove('hidden');
      }
      return;
    }

    if (this.state === 'PLAYING') {
      if (x >= this.soundBox.x && x <= this.soundBox.x + this.soundBox.w &&
          y >= this.soundBox.y && y <= this.soundBox.y + this.soundBox.h) {
        this.soundEnabled = !this.soundEnabled;
        return;
      }
      if (x >= this.pauseBox.x && x <= this.pauseBox.x + this.pauseBox.w &&
          y >= this.pauseBox.y && y <= this.pauseBox.y + this.pauseBox.h) {
        this.state = 'PAUSED';
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
    
    this.enemies.push(new EnemyClass(ex, ey, tx, ty));
  }
  loop(timestamp) {
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.state === 'MENU') {
      // Handled by HTML UI
    } 
    else if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'GAME_OVER') {
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
        this.flashes.forEach(f => f.life -= dt);
        
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.shockwaves = this.shockwaves.filter(s => !s.markedForDeletion);
        this.textEffects = this.textEffects.filter(t => !t.markedForDeletion);
        this.flashes = this.flashes.filter(f => f.life > 0);
      }
      
      this.flashes.forEach(f => {
        this.ctx.globalAlpha = (f.life / f.maxLife) * 0.15; // Low base opacity to allow stacking
        this.ctx.fillStyle = f.color;
        this.ctx.fillRect(0, 0, this.width, this.height);
      });
      this.ctx.globalAlpha = 1.0;
      
      this.tower.draw(this.ctx);
      this.enemies.forEach(e => e.draw(this.ctx));
      this.projectiles.forEach(p => p.draw(this.ctx));
      this.shockwaves.forEach(s => s.draw(this.ctx));
      this.textEffects.forEach(t => t.draw(this.ctx));
      
      this.ctx.fillStyle = '#fd0';
      this.ctx.beginPath(); this.ctx.arc(30, 30, 12, 0, Math.PI*2); this.ctx.fill();
      this.ctx.fillStyle = '#000'; this.ctx.font = '14px monospace'; this.ctx.textAlign = 'center'; this.ctx.fillText('$', 30, 35);
      this.ctx.fillStyle = '#fff'; this.ctx.textAlign = 'left'; this.ctx.font = '20px monospace'; this.ctx.fillText(this.formatNumber(this.currency), 50, 37);
      
      this.ctx.fillStyle = '#0df';
      this.ctx.beginPath();
      for(let i=0; i<5; i++) {
        this.ctx.lineTo(30 + 12*Math.cos(-Math.PI/2 + i*2*Math.PI/5), 65 + 12*Math.sin(-Math.PI/2 + i*2*Math.PI/5));
        this.ctx.lineTo(30 + 5*Math.cos(-Math.PI/2 + (i+0.5)*2*Math.PI/5), 65 + 5*Math.sin(-Math.PI/2 + (i+0.5)*2*Math.PI/5));
      }
      this.ctx.closePath(); this.ctx.fill();
      this.ctx.fillStyle = '#fff'; this.ctx.fillText(this.formatNumber(this.score), 50, 72);
      
      this.ctx.fillStyle = '#f0f';
      this.ctx.beginPath();
      this.ctx.moveTo(30, 95); this.ctx.lineTo(35, 105); this.ctx.lineTo(25, 105);
      this.ctx.closePath(); this.ctx.fill();
      this.ctx.fillStyle = '#fff'; this.ctx.fillText(this.level, 50, 107);
      
      this.upgrades.forEach(upg => {
        let color = this.currency >= upg.cost ? '#0f0' : '#888';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(upg.box.x, upg.box.y, upg.box.w, upg.box.h);
        upg.draw(this.ctx, upg.box.x, upg.box.y, upg.box.w, upg.box.h, color);
        this.ctx.fillStyle = color;
        let fontSize = Math.max(10, Math.floor(upg.box.w * 0.28));
        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.formatNumber(upg.cost), upg.box.x + upg.box.w / 2, upg.box.y + upg.box.h + fontSize + 4);
      });
      this.ctx.textAlign = 'left';

      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(this.pauseBox.x, this.pauseBox.y, this.pauseBox.w, this.pauseBox.h);
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(this.pauseBox.x + 8, this.pauseBox.y + 8, 4, 14);
      this.ctx.fillRect(this.pauseBox.x + 18, this.pauseBox.y + 8, 4, 14);

      this.ctx.font = '12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.formatTime(this.time), this.pauseBox.x + this.pauseBox.w / 2, this.pauseBox.y + this.pauseBox.h + 16);
      this.ctx.textAlign = 'left';

      this.ctx.strokeRect(this.soundBox.x, this.soundBox.y, this.soundBox.w, this.soundBox.h);
      this.ctx.beginPath();
      this.ctx.moveTo(this.soundBox.x + 8, this.soundBox.y + 12);
      this.ctx.lineTo(this.soundBox.x + 14, this.soundBox.y + 12);
      this.ctx.lineTo(this.soundBox.x + 20, this.soundBox.y + 6);
      this.ctx.lineTo(this.soundBox.x + 20, this.soundBox.y + 24);
      this.ctx.lineTo(this.soundBox.x + 14, this.soundBox.y + 18);
      this.ctx.lineTo(this.soundBox.x + 8, this.soundBox.y + 18);
      this.ctx.fill();
      if (!this.soundEnabled) {
        this.ctx.strokeStyle = '#f00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.soundBox.x + 5, this.soundBox.y + 5);
        this.ctx.lineTo(this.soundBox.x + 25, this.soundBox.y + 25);
        this.ctx.stroke();
      }

      if (this.state === 'PAUSED') {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2 - 100);
        
        let cx = this.width / 2;
        let cy = this.height / 2;
        
        this.ctx.font = '24px monospace';
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(cx - 100, cy - 60, 200, 40);
        this.ctx.fillText('Resume', cx, cy - 32);
        
        this.ctx.strokeRect(cx - 100, cy, 200, 40);
        this.ctx.fillText('Reset', cx, cy + 28);
        
        this.ctx.strokeRect(cx - 100, cy + 60, 200, 40);
        this.ctx.fillText('Quit', cx, cy + 88);
        
        this.ctx.textAlign = 'left';
      }

      if (this.state === 'GAME_OVER') {
        // Handled by HTML UI
      }
    }
    
    requestAnimationFrame(this.loop);
  }
}
