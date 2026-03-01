export class SplashEffect {
  constructor(x, y, color, radius, duration) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.duration = duration;
    this.life = duration;
    this.markedForDeletion = false;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.duration);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
