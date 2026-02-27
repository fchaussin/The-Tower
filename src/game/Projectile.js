import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(x, y, target, damage, speed) {
    super(x, y);
    this.target = target;
    this.damage = damage;
    this.speed = speed;
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
      if (dist < this.speed * dt) {
        this.target.health -= this.damage;
        this.markedForDeletion = true;
        game.playSound('hit');
        if (game.spawnShockwave) {
          let product = this.target.radius * this.damage;
          let maxRadius = this.target.radius + 10 + (product * 0.5);
          let maxAmplitude = 2 + (product * 0.1);
          game.spawnShockwave(this.target.x, this.target.y, this.target.color, maxRadius, 0.2, this.target, maxAmplitude);
        }
        return;
      }
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    if (this.x < 0 || this.x > game.width || this.y < 0 || this.y > game.height) {
      this.markedForDeletion = true;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
  }
}
