import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(x, y, target, damage, speed, tower) {
    super(x, y);
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.tower = tower;
    this.radius = 4;
    
    let dx = target.x - x;
    let dy = target.y - y;
    let dist = Math.hypot(dx, dy);
    this.vx = dist > 0 ? (dx / dist) * this.speed : 0;
    this.vy = dist > 0 ? (dy / dist) * this.speed : 0;
  }
  
  update(dt, game) {
    if (!this.target.markedForDeletion) {
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let dist = Math.hypot(dx, dy);
      if (dist - this.target.radius < this.speed * dt) {
        this.applyDamageAndEffects(this.target, game);
        this.markedForDeletion = true;
        return;
      }
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
    } else {
      // Target died before projectile reached it, just fly straight
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      
      // Check collision with other enemies (optimized with squared distance)
      for (let i = 0; i < game.enemies.length; i++) {
        let e = game.enemies[i];
        if (!e.markedForDeletion) {
          let dx = e.x - this.x;
          let dy = e.y - this.y;
          let rSum = this.radius + e.radius;
          if (dx * dx + dy * dy < rSum * rSum) {
            this.applyDamageAndEffects(e, game);
            this.markedForDeletion = true;
            return;
          }
        }
      }

      if (this.x < 0 || this.x > game.width || this.y < 0 || this.y > game.height) {
        this.markedForDeletion = true;
      }
      return;
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  
  applyDamageAndEffects(target, game) {
    let currentDamage = this.damage;
    target.health -= currentDamage;
    game.audioManager.playSound('hit');
    
    // Splash Damage
    if (this.tower && this.tower.splashRadius > 0) {
      let baseSplashDamage = currentDamage;
      
      for (let e of game.enemies) {
        if (e !== target && !e.markedForDeletion) {
          let dist = Math.hypot(e.x - target.x, e.y - target.y);
          let edgeDist = dist - e.radius;
          if (edgeDist <= this.tower.splashRadius) {
            // Splash falloff: 50% at the edge
            let falloff = 1 - 0.5 * (Math.max(0, edgeDist) / this.tower.splashRadius);
            e.health -= baseSplashDamage * falloff;
          }
        }
      }
      if (game.spawnSplashEffect) {
        const splashFeature = game.upgrades.find(u => u.id === 'splash');
        const color = splashFeature ? splashFeature.color : '#f80';
        game.spawnSplashEffect(target.x, target.y, color, this.tower.splashRadius, 1.0, 1.0);
      }
    } else {
      if (game.spawnShockwave) {
        // Shockwave proportional to enemy's maxHealth (capped) and radius
        let power = Math.min(100, target.maxHealth);
        let maxRadius = target.radius + 10 + (power * 0.5);
        let maxAmplitude = 2 + (power * 0.1);
        game.spawnShockwave(target.x, target.y, target.color, maxRadius, 0.2, target, maxAmplitude);
      }
    }
    
    // Poison
    if (this.tower && this.tower.poisonDamage > 0) {
      target.poisonDamage = this.tower.poisonDamage;
      target.poisonDuration = this.tower.poisonDuration;
    }

    // Slow
    if (this.tower && this.tower.slowIntensity > 0) {
      // Apply slow to main target
      target.slowIntensity = this.tower.slowIntensity;
      target.slowDuration = this.tower.slowDuration;

      // Apply slow to splash targets if splash is active
      if (this.tower.splashRadius > 0) {
        for (let e of game.enemies) {
          if (e !== target && !e.markedForDeletion) {
            let dist = Math.hypot(e.x - target.x, e.y - target.y);
            let edgeDist = dist - e.radius;
            if (edgeDist <= this.tower.splashRadius) {
              e.slowIntensity = this.tower.slowIntensity;
              e.slowDuration = this.tower.slowDuration;
            }
          }
        }
      }
    }

    // Spawn Chain Lightning if applicable
    if (this.tower && this.tower.lightningCount > 0 && game.spawnChainLightning) {
      game.spawnChainLightning(target.x, target.y, this.damage, this.tower, [target]);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
  }
}
