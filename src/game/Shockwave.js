export class Shockwave {
  constructor(x, y, color, maxRadius = 30, duration = 0.3, target = null, maxAmplitude = 5) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.life = duration;
    this.maxLife = duration;
    this.target = target;
    this.maxAmplitude = maxAmplitude;
    this.markedForDeletion = false;
  }

  update(dt) {
    if (this.target && !this.target.markedForDeletion) {
      this.x = this.target.x;
      this.y = this.target.y;
    }
    this.life -= dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
    } else {
      // Ease-out effect: expands quickly at first, then slows down
      let progress = 1 - (this.life / this.maxLife);
      this.radius = this.maxRadius * (1 - Math.pow(1 - progress, 3));
    }
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.max(1, this.maxAmplitude * (this.life / this.maxLife));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
}
