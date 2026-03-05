import { Entity } from '../Entity.js';

export class Enemy extends Entity {
  constructor({ x, y, targetX, targetY, radius, maxHealth, speed, color, shape = 'circle', style = 'fill', isBoss = false }) {
    super(x, y);
    this.targetX = targetX;
    this.targetY = targetY;
    this.radius = radius;
    this.maxHealth = maxHealth;
    this.health = this.maxHealth;
    this.speed = speed;
    this.color = color;
    this.shape = shape;
    this.style = style;
    this.isBoss = isBoss;
    this.poisonDamage = 0;
    this.poisonDuration = 0;
    this.poisonTimer = 0;
    this.slowDuration = 0;
    this.slowIntensity = 0;
    this.originalSpeed = speed;
    this.updateVelocity();
  }
  applyDifficulty(settings, level = 1) {
    if (!settings) return;
    
    // Infinite scaling: +15% health per level, +2% speed per level (capped at 2.5x)
    const infiniteHealthMult = Math.pow(1.15, Math.max(0, level - 1));
    const infiniteSpeedMult = Math.min(2.5, Math.pow(1.02, Math.max(0, level - 1)));

    if (settings.enemyHealthMult) {
      this.maxHealth = Math.ceil(this.maxHealth * settings.enemyHealthMult * infiniteHealthMult);
      this.health = this.maxHealth;
    }
    if (settings.enemySpeedMult) {
      this.speed = this.speed * settings.enemySpeedMult * infiniteSpeedMult;
      this.originalSpeed = this.speed;
      this.updateVelocity();
    }
  }
  updateVelocity() {
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let dist = Math.hypot(dx, dy);
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }
  update(dt, game) {
    if (this.slowDuration > 0) {
      this.slowDuration -= dt;
      this.speed = this.originalSpeed * (1 - this.slowIntensity);
      if (this.slowDuration <= 0) {
        this.speed = this.originalSpeed;
        this.slowIntensity = 0;
      }
      this.updateVelocity();
    }

    if (this.poisonDuration > 0) {
      this.poisonDuration -= dt;
      this.poisonTimer += dt;
      if (this.poisonTimer >= 1) { // Apply poison damage every 1 second
        this.health -= this.poisonDamage;
        this.poisonTimer = 0;
        
        // Visual effect for poison tick
        if (game.spawnShockwave) {
          game.spawnShockwave(this.x, this.y, '#0f0', this.radius + 5, 0.2, null, 2);
        }
      }
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    let dx = game.tower.x - this.x;
    let dy = game.tower.y - this.y;
    let dist = Math.hypot(dx, dy);
    if (dist < this.radius + game.tower.radius) {
      let overlap = (this.radius + game.tower.radius) - dist;
      let angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * overlap;
      this.y -= Math.sin(angle) * overlap;
      
      this.markedForDeletion = true;
      game.loseLife();
      
      if (game.spawnShockwave) {
        game.spawnShockwave(this.x, this.y, '#f00', 50, 0.3, null, 10);
      }
      if (game.spawnFlash) {
        game.spawnFlash('#f00', 0.2);
      }
    }
    if (this.health <= 0) {
      this.die(game);
    }
  }
  die(game) {
    this.markedForDeletion = true;
    if (this.isBoss) {
      game.audioManager.playSound('bossDeath');
    } else {
      game.audioManager.playExplosion();
    }
    game.currency += this.getCurrencyValue();
    game.score += this.getScoreValue();
    if (game.spawnShockwave) {
      let maxRadius = this.radius * 3 + 20;
      let maxAmplitude = Math.max(4, this.radius * 0.5);
      game.spawnShockwave(this.x, this.y, this.color, maxRadius, 0.4, null, maxAmplitude);
    }
    if (game.spawnFlash) {
      let flashDuration = 0.1 + (this.radius * 0.008); // Duration scales with enemy size
      game.spawnFlash(this.color, flashDuration);
    }
  }
  getCurrencyValue() { return 1; }
  getScoreValue() { return 10; }
  draw(ctx) {
    ctx.beginPath();
    
    let angleOffset = Math.atan2(this.vy, this.vx);

    if (this.shape === 'circle') {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    } else if (this.shape === 'square') {
      ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    } else if (this.shape === 'triangle') {
      for (let i = 0; i < 3; i++) {
        let a = angleOffset + i * (Math.PI * 2 / 3);
        let px = this.x + Math.cos(a) * this.radius;
        let py = this.y + Math.sin(a) * this.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (this.shape === 'hexagon') {
      for (let i = 0; i < 6; i++) {
        let a = angleOffset + i * (Math.PI * 2 / 6);
        let px = this.x + Math.cos(a) * this.radius;
        let py = this.y + Math.sin(a) * this.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (this.shape === 'diamond') {
      for (let i = 0; i < 4; i++) {
        let a = angleOffset + i * (Math.PI * 2 / 4);
        let px = this.x + Math.cos(a) * this.radius;
        let py = this.y + Math.sin(a) * this.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (this.shape === 'star') {
      for (let i = 0; i < 10; i++) {
        let a = angleOffset + i * (Math.PI * 2 / 10);
        let r = i % 2 === 0 ? this.radius : this.radius * 0.5;
        let px = this.x + Math.cos(a) * r;
        let py = this.y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    if (this.style === 'fill') {
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (this.poisonDuration > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 4 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#0f0';
      for (let i = 0; i < 3; i++) {
        let bx = this.x + Math.cos(Date.now() / 200 + i * 2) * (this.radius + 6);
        let by = this.y + Math.sin(Date.now() / 200 + i * 2) * (this.radius + 6);
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.slowDuration > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#4af';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Ice crystals effect
      ctx.fillStyle = '#4af';
      for (let i = 0; i < 4; i++) {
        let angle = (Date.now() / 500) + (i * Math.PI / 2);
        let bx = this.x + Math.cos(angle) * (this.radius + 4);
        let by = this.y + Math.sin(angle) * (this.radius + 4);
        ctx.beginPath();
        ctx.rect(bx - 2, by - 2, 4, 4);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 0.8;
    let bw = 20;
    let bh = 4;
    let bx = this.x - bw / 2;
    let by = this.y - this.radius - 8;
    
    ctx.fillStyle = '#800';
    ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
    
    ctx.fillStyle = '#f00';
    ctx.fillRect(bx, by, bw * Math.max(0, this.health / this.maxHealth), bh);
    ctx.globalAlpha = 1.0;
  }
}
