import { TowerFeature } from './TowerFeature.js';

export class SpeedFeature extends TowerFeature {
  constructor() {
    super({
      id: 'speed',
      baseCost: 100,
      costMultiplier: 1.15,
      costAddition: 5,
      baseIntensity: 10,
      intensityMultiplier: 1,
      intensityAddition: 2,
      color: '#ff0'
    });
  }

  apply(tower, intensity) {
    tower.projectileSpeed += intensity;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + h / 2);
    ctx.lineTo(x + w * 0.8, y + h / 2);
    ctx.moveTo(x + w * 0.6, y + h * 0.3);
    ctx.lineTo(x + w * 0.8, y + h / 2);
    ctx.lineTo(x + w * 0.6, y + h * 0.7);
    ctx.moveTo(x + w * 0.2, y + h * 0.3);
    ctx.lineTo(x + w * 0.4, y + h * 0.3);
    ctx.moveTo(x + w * 0.2, y + h * 0.7);
    ctx.lineTo(x + w * 0.4, y + h * 0.7);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
