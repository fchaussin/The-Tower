import { TowerFeature } from './TowerFeature.js';

export class DamageFeature extends TowerFeature {
  constructor() {
    super({
      id: 'damage',
      baseCost: 5,
      costMultiplier: 1.3,
      costAddition: 2,
      baseIntensity: 1,
      intensityMultiplier: 1,
      intensityAddition: 0.5
    });
  }

  apply(tower, intensity) {
    tower.damage += intensity;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + h * 0.8);
    ctx.lineTo(x + w * 0.8, y + h * 0.2);
    ctx.moveTo(x + w * 0.3, y + h * 0.9);
    ctx.lineTo(x + w * 0.1, y + h * 0.7);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
