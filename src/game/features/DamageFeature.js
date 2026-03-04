import { TowerFeature } from './TowerFeature.js';

export class DamageFeature extends TowerFeature {
  constructor() {
    super({
      id: 'damage',
      baseCost: 15,
      costMultiplier: 1.3,
      costAddition: 10,
      baseIntensity: 1.0,
      intensityMultiplier: 1.2,
      intensityAddition: 0,
      color: '#f00'
    });
  }

  apply(tower, intensity) {
    tower.damage += intensity;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    // Blade
    ctx.moveTo(x + w * 0.4, y + h * 0.6);
    ctx.lineTo(x + w * 0.8, y + h * 0.2);
    // Crossguard
    ctx.moveTo(x + w * 0.3, y + h * 0.5);
    ctx.lineTo(x + w * 0.5, y + h * 0.7);
    // Handle
    ctx.moveTo(x + w * 0.4, y + h * 0.6);
    ctx.lineTo(x + w * 0.25, y + h * 0.75);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
