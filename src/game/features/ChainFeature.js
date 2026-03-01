import { TowerFeature } from './TowerFeature.js';

export class ChainFeature extends TowerFeature {
  constructor() {
    super({
      id: 'chain',
      baseCost: 100,
      costMultiplier: 2.5,
      costAddition: 50,
      baseIntensity: 1,
      intensityMultiplier: 1,
      intensityAddition: 0.5,
      color: '#0ff'
    });
  }

  apply(tower, intensity) {
    tower.chainCount = (tower.chainCount || 0) + Math.floor(intensity);
    tower.chainRange = (tower.chainRange || 0) + 50;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h - 10);
    ctx.lineTo(x + w / 2, y + 10);
    ctx.lineTo(x + w - 10, y + h - 10);
    ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x + 10, y + h - 10, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w / 2, y + 10, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w - 10, y + h - 10, 4, 0, Math.PI*2); ctx.fill();
  }
}
