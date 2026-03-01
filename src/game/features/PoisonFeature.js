import { TowerFeature } from './TowerFeature.js';

export class PoisonFeature extends TowerFeature {
  constructor() {
    super({
      id: 'poison',
      baseCost: 200,
      costMultiplier: 2.5,
      costAddition: 2.5,
      baseIntensity: 0.1,
      intensityMultiplier: 1,
      intensityAddition: 0.2,
      color: '#0f0'
    });
  }

  apply(tower, intensity) {
    tower.poisonDamage = (tower.poisonDamage || 0) + intensity;
    tower.poisonDuration = (tower.poisonDuration || 0) + 1; // seconds
  }

  draw(ctx, x, y, w, h, color) {
    ctx.save();
    
    // Flask path
    ctx.beginPath();
    // Rim
    ctx.moveTo(x + w * 0.35, y + h * 0.15);
    ctx.lineTo(x + w * 0.65, y + h * 0.15);
    ctx.lineTo(x + w * 0.65, y + h * 0.2);
    ctx.lineTo(x + w * 0.6, y + h * 0.2);
    // Neck
    ctx.lineTo(x + w * 0.6, y + h * 0.4);
    // Body
    ctx.lineTo(x + w * 0.85, y + h * 0.85);
    ctx.lineTo(x + w * 0.15, y + h * 0.85);
    ctx.lineTo(x + w * 0.4, y + h * 0.4);
    // Neck left
    ctx.lineTo(x + w * 0.4, y + h * 0.2);
    // Rim left
    ctx.lineTo(x + w * 0.35, y + h * 0.2);
    ctx.closePath();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.clip();

    // Liquid
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h * 0.55, w, h * 0.45);

    ctx.restore();
  }
}
