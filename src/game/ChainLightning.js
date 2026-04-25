import { Entity } from './Entity.js';

export class ChainLightning extends Entity {
  constructor(x, y, damage, tower, hitEnemies, countRemaining, hitIndex) {
    super(x, y);
    this.damage = damage;
    this.tower = tower;
    this.hitEnemies = new Set(hitEnemies);
    this.countRemaining = countRemaining;
    this.hitIndex = hitIndex;
    this.chainDelay = 0;
    this.nextTarget = null;
  }

  update(dt, game) {
    if (this.markedForDeletion) return;

    if (this.chainDelay > 0) {
      this.chainDelay -= dt;
      if (this.chainDelay > 0) return;
    }

    // Time to strike next target
    if (!this.nextTarget || this.nextTarget.markedForDeletion) {
      this.nextTarget = this.findTarget(game);
      if (!this.nextTarget) {
        this.markedForDeletion = true;
        return;
      }
    }

    // Strike!
    if (game.spawnLightningEffect) {
      const lightningFeature = game.upgrades.find(u => u.id === 'lightning');
      const color = lightningFeature ? lightningFeature.color : '#0ff';
      game.spawnLightningEffect(this.x, this.y, this.nextTarget.x, this.nextTarget.y, color, 0.2);
    }

    // Apply damage and effects
    this.applyDamageAndEffects(this.nextTarget, game);

    // Update state for next bounce
    this.x = this.nextTarget.x;
    this.y = this.nextTarget.y;
    this.hitEnemies.add(this.nextTarget);
    this.countRemaining--;
    this.hitIndex++;
    this.nextTarget = null;

    if (this.countRemaining > 0) {
      this.nextTarget = this.findTarget(game);
      if (this.nextTarget) {
        this.chainDelay = 0.15 * Math.pow(0.5, this.hitIndex);
      } else {
        this.markedForDeletion = true;
      }
    } else {
      this.markedForDeletion = true;
    }
  }

  applyDamageAndEffects(target, game) {
    // Lightning damage falloff: 100%, 50%, 25%, 12.5%...
    let currentDamage = this.damage * Math.pow(0.5, this.hitIndex);
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
            let falloff = 1 - 0.5 * (Math.max(0, edgeDist) / this.tower.splashRadius);
            e.health -= baseSplashDamage * falloff;
          }
        }
      }
      if (game.spawnSplashEffect) {
        const splashFeature = game.upgrades.find(u => u.id === 'splash');
        const color = splashFeature ? splashFeature.color : '#f80';
        const remainingIntensity = Math.pow(0.5, this.hitIndex);
        game.spawnSplashEffect(target.x, target.y, color, this.tower.splashRadius, 1.0, remainingIntensity);
      }
    } else {
      if (game.spawnShockwave) {
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
      target.slowIntensity = this.tower.slowIntensity;
      target.slowDuration = this.tower.slowDuration;

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
  }

  findTarget(game) {
    let lightningRange = this.tower.lightningRange || 100;
    let closest = null;
    let minDst = Infinity;

    for (let e of game.enemies) {
      if (!this.hitEnemies.has(e) && !e.markedForDeletion) {
        let dx = e.x - this.x;
        let dy = e.y - this.y;
        let dist = Math.hypot(dx, dy);
        let edgeDist = dist - e.radius;

        if (edgeDist <= lightningRange && edgeDist < minDst) {
          minDst = edgeDist;
          closest = e;
        }
      }
    }
    return closest;
  }

  draw(ctx) {
    // ChainLightning is invisible, it just spawns LightningEffects
  }
}
