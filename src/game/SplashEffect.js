export class SplashEffect {
  constructor(x, y, color, radius, duration, intensity = 1.0) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.duration = duration;
    this.life = duration;
    this.intensity = intensity;
    this.markedForDeletion = false;
    
    // Generate irregular blob points
    this.points = [];
    const numPoints = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.2); // 0.8 to 1.0 times radius
      this.points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.duration) * this.intensity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const firstP = this.points[0];
    const lastP = this.points[this.points.length - 1];
    ctx.moveTo(this.x + (lastP.x + firstP.x) / 2, this.y + (lastP.y + firstP.y) / 2);
    
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const nextP = this.points[(i + 1) % this.points.length];
      const xc = this.x + (p.x + nextP.x) / 2;
      const yc = this.y + (p.y + nextP.y) / 2;
      ctx.quadraticCurveTo(this.x + p.x, this.y + p.y, xc, yc);
    }
    
    ctx.stroke();
    ctx.restore();
  }
}
