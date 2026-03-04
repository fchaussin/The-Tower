import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(x, y, target, damage, speed, tower) {
    super(x, y);
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.tower = tower;
    this.radius = 4;
    this.chainedTo = new Set([target]); // Keep track of hit enemies to avoid bouncing back
    this.chainCountRemaining = tower ? (tower.chainCount || 0) : 0;
    this.hitIndex = 0;
    
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
      if (dist < this.speed * dt) {
        this.applyDamageAndEffects(this.target, game);
        
        // Handle Chain
        if (this.chainCountRemaining > 0) {
          let nextTarget = this.findChainTarget(game);
          if (nextTarget) {
            if (game.spawnChainEffect) {
              const chainFeature = game.upgrades.find(u => u.id === 'chain');
              const color = chainFeature ? chainFeature.color : '#0ff';
              game.spawnChainEffect(this.target.x, this.target.y, nextTarget.x, nextTarget.y, color, 0.2);
            }
            this.target = nextTarget;
            this.chainedTo.add(nextTarget);
            this.chainCountRemaining--;
            this.hitIndex++;
            this.x = this.target.x; // Snap to target before bouncing
            this.y = this.target.y;
            return; // Continue flying to next target
          }
        }
        
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
            
            // Handle Chain
            if (this.chainCountRemaining > 0) {
              let nextTarget = this.findChainTarget(game);
              if (nextTarget) {
                if (game.spawnChainEffect) {
                  const chainFeature = game.upgrades.find(u => u.id === 'chain');
                  const color = chainFeature ? chainFeature.color : '#0ff';
                  game.spawnChainEffect(e.x, e.y, nextTarget.x, nextTarget.y, color, 0.2);
                }
                this.target = nextTarget;
                this.chainedTo.add(nextTarget);
                this.chainCountRemaining--;
                this.hitIndex++;
                this.x = e.x;
                this.y = e.y;
                return;
              }
            }
            
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
    // Chain damage falloff: 100%, 60%, 36%, 21%...
    let currentDamage = this.damage * Math.pow(0.6, this.hitIndex);
    target.health -= currentDamage;
    game.audioManager.playSound('hit');
    
    // Splash Damage
    if (this.tower && this.tower.splashRadius > 0) {
      // Splash damage also follows chain falloff if it's a chain hit
      let baseSplashDamage = this.tower.splashDamage * Math.pow(0.6, this.hitIndex);
      
      for (let e of game.enemies) {
        if (e !== target && !e.markedForDeletion) {
          let dist = Math.hypot(e.x - target.x, e.y - target.y);
          if (dist <= this.tower.splashRadius) {
            // Splash falloff: linear from center to edge
            let falloff = 1 - (dist / this.tower.splashRadius);
            e.health -= baseSplashDamage * falloff;
          }
        }
      }
      if (game.spawnShockwave) {
        const splashFeature = game.upgrades.find(u => u.id === 'splash');
        const color = splashFeature ? splashFeature.color : '#f80';
        game.spawnShockwave(target.x, target.y, color, this.tower.splashRadius, 1.0, null, 3, true);
      }
    } else {
      if (game.spawnShockwave) {
        let product = target.radius * this.damage;
        let maxRadius = target.radius + 10 + (product * 0.5);
        let maxAmplitude = 2 + (product * 0.1);
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
            if (dist <= this.tower.splashRadius) {
              e.slowIntensity = this.tower.slowIntensity;
              e.slowDuration = this.tower.slowDuration;
            }
          }
        }
      }
    }
  }
  
  findChainTarget(game) {
    let bestTarget = null;
    let minDst = Infinity;
    let chainRange = this.tower.chainRange || 100;
    
    for (let e of game.enemies) {
      if (!this.chainedTo.has(e) && !e.markedForDeletion) {
        let dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist <= chainRange && dist < minDst) {
          minDst = dist;
          bestTarget = e;
        }
      }
    }
    return bestTarget;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
  }
}
