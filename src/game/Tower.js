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
  }
  update(dt, game) {
    if (game.time - this.lastFireTime > this.cooldown) {
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
        game.projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.projectileSpeed));
        this.lastFireTime = game.time;
        game.playSound('shoot');
      }
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}
