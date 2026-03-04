export class TextEffect {
  constructor(x, y, text, color, size, duration = 2.0) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.size = size;
    this.life = duration;
    this.maxLife = duration;
    this.vy = -40;
    this.markedForDeletion = false;
  }
  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.markedForDeletion = true;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
