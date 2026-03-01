import { TowerFeature } from './TowerFeature.js';

export class DamageFeature extends TowerFeature {
  constructor() {
    super({
      id: 'damage',
      baseCost: 20,
      costMultiplier: 1.5,
      costAddition: 2,
      baseIntensity: 1,
      intensityMultiplier: 1,
      intensityAddition: 0.5,
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
