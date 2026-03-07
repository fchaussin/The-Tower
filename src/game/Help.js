import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { LightningFeature } from './features/LightningFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';
import { SlowFeature } from './features/SlowFeature.js';
import { IconRenderer } from './IconRenderer.js';

import { Tower } from './Tower.js';
import { Enemy } from './enemies/Enemy.js';
import { Projectile } from './Projectile.js';
import { LightningEffect } from './LightningEffect.js';
import { SplashEffect } from './SplashEffect.js';

export class Help {
  constructor() {
    this.features = [
      { id: 'damage', title: 'Damage', desc: 'Increases the damage dealt by each projectile.', feature: new DamageFeature() },
      { id: 'cooldown', title: 'Cooldown', desc: 'Reduces the time between shots.', feature: new CooldownFeature() },
      { id: 'speed', title: 'Speed', desc: 'Increases the firing speed of projectiles.', feature: new SpeedFeature() },
      { id: 'range', title: 'Range', desc: 'Increases the targeting radius of the tower.', feature: new RangeFeature() },
      { id: 'splash', title: 'Splash', desc: 'Projectiles deal area-of-effect damage on impact.', feature: new SplashFeature() },
      { id: 'lightning', title: 'Lightning', desc: 'Projectiles bounce to additional nearby enemies.', feature: new LightningFeature() },
      { id: 'poison', title: 'Poison', desc: 'Applies damage over time to enemies hit.', feature: new PoisonFeature() },
      { id: 'slow', title: 'Slow', desc: 'Reduces enemy movement speed for a duration.', feature: new SlowFeature() }
    ];
    this.currentIndex = 0;
    this.animationFrameId = null;
    this.lastTime = 0;
  }

  init() {
    this.buildCarousel();
    this.setupEvents();
  }

  buildCarousel() {
    const track = document.getElementById('helpCarouselTrack');
    const indicators = document.getElementById('helpCarouselIndicators');
    
    if (!track || !indicators) return;

    track.innerHTML = '';
    indicators.innerHTML = '';
    
    const trackFragment = document.createDocumentFragment();
    const indicatorsFragment = document.createDocumentFragment();
    
    this.features.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'carousel-slide';
      li.innerHTML = `
        <div class="slide-row1">
          <div class="slide-col-icon">
            <canvas id="${item.id}" width="100" height="100"></canvas>
          </div>
          <div class="slide-col-preview">
            <canvas id="${item.id}-preview" width="100" height="100"></canvas>
          </div>
        </div>
        <div class="slide-row2">
          <div class="slide-title" style="color: ${item.feature.color}">${item.title}</div>
          <div class="slide-desc">${item.desc}</div>
        </div>
      `;
      trackFragment.appendChild(li);

      const dot = document.createElement('div');
      dot.className = `indicator ${index === 0 ? 'current' : ''}`;
      dot.dataset.index = index;
      indicatorsFragment.appendChild(dot);
    });

    track.appendChild(trackFragment);
    indicators.appendChild(indicatorsFragment);

    this.features.forEach(({ id, feature }) => {
      const canvas = document.getElementById(id);
      if (canvas) {
        IconRenderer.renderIcon(canvas, feature);
      }
    });
  }

  setupEvents() {
    const track = document.getElementById('helpCarouselTrack');
    const prevBtn = document.getElementById('prevHelpBtn');
    const nextBtn = document.getElementById('nextHelpBtn');
    
    if (!track || !prevBtn || !nextBtn) return;

    const updateCarousel = () => {
      const slides = track.children;
      const totalSlides = slides.length;
      if (totalSlides === 0) return;
      
      const indicators = document.querySelectorAll('#helpCarouselIndicators .indicator');

      track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      indicators.forEach((ind, i) => {
        ind.classList.toggle('current', i === this.currentIndex);
      });
    };

    prevBtn.addEventListener('click', () => {
      const totalSlides = track.children.length;
      this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : totalSlides - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      const totalSlides = track.children.length;
      this.currentIndex = (this.currentIndex < totalSlides - 1) ? this.currentIndex + 1 : 0;
      updateCarousel();
    });

    const indicatorsContainer = document.getElementById('helpCarouselIndicators');
    if (indicatorsContainer) {
      indicatorsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('indicator')) {
          this.currentIndex = parseInt(e.target.dataset.index, 10);
          updateCarousel();
        }
      });
    }

    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const totalSlides = track.children.length;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.currentIndex = (this.currentIndex < totalSlides - 1) ? this.currentIndex + 1 : 0;
        } else {
          this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : totalSlides - 1;
        }
      }
      updateCarousel();
    });
    
    setTimeout(updateCarousel, 100);
  }

  startAnimationLoop() {
    this.lastTime = performance.now();
    const loop = (time) => {
      const dt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      this.renderPreviews(time, dt);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  renderPreviews(time, dt) {
    const currentFeature = this.features[this.currentIndex];
    if (!currentFeature) return;

    const canvas = document.getElementById(`${currentFeature.id}-preview`);
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    const mockGame = { time: time, upgrades: [currentFeature.feature] };

    let towerY = cy;
    if (currentFeature.feature instanceof DamageFeature) {
      towerY = cy + 25;
    }
    const tower = new Tower(cx, towerY);
    tower.range = 35;
    
    if (currentFeature.feature instanceof RangeFeature) {
      tower.highlightRangeTimer = 500;
    }
    
    if (currentFeature.feature instanceof CooldownFeature) {
      tower.cooldownProgress = (time % 1000) / 1000;
    } else if (currentFeature.feature instanceof DamageFeature) {
      const cycleTime = time % 3000;
      if (cycleTime < 1800) {
        tower.cooldownProgress = ((cycleTime + 500) % 600) / 600;
      } else {
        tower.cooldownProgress = 1;
      }
    } else {
      tower.cooldownProgress = 1;
    }

    const showTower = currentFeature.feature instanceof DamageFeature ||
                      currentFeature.feature instanceof CooldownFeature ||
                      currentFeature.feature instanceof SpeedFeature ||
                      currentFeature.feature instanceof RangeFeature;

    if (showTower) {
      tower.drawBackground(ctx, mockGame);
    }

    if (currentFeature.feature instanceof DamageFeature) {
      const cycleTime = time % 3000;
      const isAlive = cycleTime < 1800;
      const bossY = cy - 25;
      
      if (isAlive) {
        const boss = new Enemy({ x: cx, y: bossY, targetX: cx, targetY: cy, radius: 15, maxHealth: 100, speed: 0, color: '#f0f', isBoss: true, shape: 'hexagon' });
        
        let health = 100;
        if (cycleTime > 600) health -= 33;
        if (cycleTime > 1200) health -= 33;
        boss.health = health;
        boss.draw(ctx);
        
        ctx.fillStyle = 'red';
        ctx.fillRect(cx - 15, bossY - 22, 30, 4);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(cx - 15, bossY - 22, 30 * (Math.max(0, health) / 100), 4);

        const drawProj = (startTime) => {
          if (cycleTime > startTime && cycleTime < startTime + 500) {
            const progress = (cycleTime - startTime) / 500;
            const pY = towerY - progress * (towerY - bossY);
            const p = new Projectile(cx, pY, boss, 10, 0, tower);
            p.radius = 6;
            p.draw(ctx);
          }
        };
        
        drawProj(100);
        drawProj(700);
        drawProj(1300);
        
      } else {
        const explosionProgress = (cycleTime - 1800) / 1200;
        ctx.beginPath();
        ctx.arc(cx, bossY, 15 + explosionProgress * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 0, 255, ${1 - explosionProgress})`;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx, bossY, explosionProgress * 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - explosionProgress})`;
        ctx.fill();
      }
    } else if (currentFeature.feature instanceof SpeedFeature) {
      const yOffset1 = (time % 400) / 400 * 40;
      const proj1 = new Projectile(cx, cy - yOffset1, {x: cx, y: cy-40}, 10, 0, tower);
      proj1.draw(ctx);
      
      const yOffset2 = ((time + 200) % 400) / 400 * 40;
      const proj2 = new Projectile(cx, cy - yOffset2, {x: cx, y: cy-40}, 10, 0, tower);
      proj2.draw(ctx);
    } else if (currentFeature.feature instanceof SplashFeature) {
      const splash = new SplashEffect(cx, cy, currentFeature.feature.color, 30, 1.0);
      splash.life = 1.0 - (time % 1500) / 1500;
      splash.draw(ctx);
    } else if (currentFeature.feature instanceof LightningFeature) {
      const e1 = new Enemy({ x: cx - 25, y: cy + 15, targetX: cx, targetY: cy, radius: 10, maxHealth: 10, speed: 0, color: '#f00' });
      const e2 = new Enemy({ x: cx + 10, y: cy - 20, targetX: cx, targetY: cy, radius: 10, maxHealth: 10, speed: 0, color: '#f00' });
      const e3 = new Enemy({ x: cx + 30, y: cy + 20, targetX: cx, targetY: cy, radius: 10, maxHealth: 10, speed: 0, color: '#f00' });
      
      e1.draw(ctx);
      e2.draw(ctx);
      e3.draw(ctx);

      const activeLightning = new LightningEffect(e1.x, e1.y, e2.x, e2.y, currentFeature.feature.color, 1.0);
      activeLightning.draw(ctx);
      const activeLightning2 = new LightningEffect(e2.x, e2.y, e3.x, e3.y, currentFeature.feature.color, 1.0);
      activeLightning2.draw(ctx);
    } else if (currentFeature.feature instanceof PoisonFeature) {
      const enemy = new Enemy({ x: cx, y: cy, targetX: cx, targetY: cy, radius: 15, maxHealth: 10, speed: 0, color: '#f00' });
      enemy.poisonDuration = 1;
      enemy.draw(ctx);
    } else if (currentFeature.feature instanceof SlowFeature) {
      const enemy = new Enemy({ x: cx, y: cy, targetX: cx, targetY: cy, radius: 15, maxHealth: 10, speed: 0, color: '#f00' });
      enemy.slowDuration = 1;
      enemy.draw(ctx);
    }

    if (showTower) {
      tower.drawForeground(ctx, mockGame);
    }
    
    ctx.restore();
  }
}
