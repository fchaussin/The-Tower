import { Entity } from './Entity.js';
import { Projectile } from './Projectile.js';

export class Tower extends Entity {
  constructor(x, y) {
    super(x, y);
    this.radius = 20;
    this.damage = 1;
    this.range = 200;
    this.cooldown = 500;
    this.projectileSpeed = 400;
    this.lastFireTime = 0;
    this.highlightRangeTimer = 0;
  }
  update(dt, game) {
    let safeDt = !isFinite(dt) || dt < 0 ? 0 : dt;
    this.pulseTimer = (this.pulseTimer || 0) + safeDt;
    if (this.pulseTimer > 2) this.pulseTimer %= 2;

    if (this.highlightRangeTimer > 0) {
      this.highlightRangeTimer -= dt * 1000;
    }
    
    this.cooldownProgress = Math.min(1, Math.max(0, (game.time - this.lastFireTime) / this.cooldown));

    if (this.cooldownProgress >= 1) {
      let target = null;
      let minDst = Infinity;
      for (let e of game.enemies) {
        let dx = e.x - this.x;
        let dy = e.y - this.y;
        let dst = Math.hypot(dx, dy);
        if (dst < this.range && dst < minDst) {
          minDst = dst;
          target = e;
        }
      }
      if (target) {
        game.projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.projectileSpeed, this));
        this.lastFireTime = game.time;
        this.cooldownProgress = 0;
        game.audioManager.playSound('shoot');
      }
    }
  }
  draw(ctx, game) {
    // Base range background
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fill();

    // Pulse effect
    if (this.pulseTimer !== undefined) {
      let progress = Math.max(0, Math.min(1, this.pulseTimer / 2));
      let pulseRadius = Math.max(0, this.range * progress);
      let pulseAlpha = Math.max(0, 0.15 * (1 - progress));
      ctx.beginPath();
      ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    if (this.highlightRangeTimer > 0) {
      let alpha = 0.1 + 0.7 * (this.highlightRangeTimer / 500);
      const rangeFeature = game.upgrades ? game.upgrades.find(u => u.id === 'range') : null;
      ctx.strokeStyle = rangeFeature ? rangeFeature.color : '#fff';
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1 + 2 * (this.highlightRangeTimer / 500);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Cooldown preloader ring
    if (this.cooldownProgress !== undefined && this.cooldownProgress < 1) {
      const cooldownFeature = game.upgrades ? game.upgrades.find(u => u.id === 'cooldown') : null;
      const cooldownColor = cooldownFeature ? cooldownFeature.color : '#fff';
      
      // Background track
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = cooldownColor;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Progress arc
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 6, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * this.cooldownProgress));
      ctx.strokeStyle = cooldownColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}
