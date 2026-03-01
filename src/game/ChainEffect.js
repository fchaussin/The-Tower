export class ChainEffect {
  constructor(x1, y1, x2, y2, color = '#0ff', duration = 0.2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.life = duration;
    this.maxLife = duration;
    this.markedForDeletion = false;
    
    this.segments = [];
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dist = Math.hypot(dx, dy);
    let numSegments = Math.max(2, Math.floor(dist / 15));
    
    let curX = x1;
    let curY = y1;
    
    for (let i = 1; i <= numSegments; i++) {
      let t = i / numSegments;
      let targetX = x1 + dx * t;
      let targetY = y1 + dy * t;
      
      if (i < numSegments) {
        let offset = (Math.random() - 0.5) * 20;
        targetX += (-dy / dist) * offset;
        targetY += (dx / dist) * offset;
      }
      
      this.segments.push({ x1: curX, y1: curY, x2: targetX, y2: targetY });
      curX = targetX;
      curY = targetY;
    }
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    
    // Glow
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let seg of this.segments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();
    
    // Core
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let seg of this.segments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
  }
}
