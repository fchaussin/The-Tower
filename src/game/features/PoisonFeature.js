import { TowerFeature } from './TowerFeature.js';

export class PoisonFeature extends TowerFeature {
  constructor() {
    super({
      id: 'poison',
      baseCost: 100,
      costMultiplier: 1.3,
      costAddition: 10,
      baseIntensity: 0.1,
      intensityMultiplier: 1,
      intensityAddition: 0.05
    });
  }

  apply(tower, intensity) {
    tower.poisonDamage = (tower.poisonDamage || 0) + intensity;
    tower.poisonDuration = (tower.poisonDuration || 0) + 1; // seconds
  }

  draw(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 10);
    ctx.bezierCurveTo(x + w - 5, y + h / 2, x + w - 10, y + h - 5, x + w / 2, y + h - 5);
    ctx.bezierCurveTo(x + 10, y + h - 5, x + 5, y + h / 2, x + w / 2, y + 10);
    ctx.fill();
  }
}
