import { TowerFeature } from './TowerFeature.js';

export class SlowFeature extends TowerFeature {
  constructor() {
    super({
      id: 'slow',
      baseCost: 150,
      costMultiplier: 1.3,
      baseIntensity: 0.05,
      intensityMultiplier: 1,
      intensityAddition: 0,
      color: '#4af'
    });
  }

  apply(tower, intensity) {
    // Slow intensity is the percentage of speed reduction
    // We cap it at 80% to avoid stopping enemies completely
    tower.slowIntensity = Math.min(0.8, (tower.slowIntensity || 0) + intensity);
    tower.slowDuration = (tower.slowDuration || 0) + 1.0; // +1 second duration per level
  }

  draw(ctx, x, y, w, h, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw a snowflake-like icon
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = 15;
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.stroke();
      
      // Small branches
      const bx = cx + Math.cos(angle) * (r * 0.6);
      const by = cy + Math.sin(angle) * (r * 0.6);
      const branchAngle1 = angle + Math.PI / 4;
      const branchAngle2 = angle - Math.PI / 4;
      const branchLen = 5;
      
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(branchAngle1) * branchLen, by + Math.sin(branchAngle1) * branchLen);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(branchAngle2) * branchLen, by + Math.sin(branchAngle2) * branchLen);
      ctx.stroke();
    }
  }
}
