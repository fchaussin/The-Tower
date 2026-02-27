import { TowerFeature } from './TowerFeature.js';

export class CooldownFeature extends TowerFeature {
  constructor() {
    super({
      id: 'cooldown',
      baseCost: 10,
      costMultiplier: 1.3,
      costAddition: 5,
      baseIntensity: 0.85,
      intensityMultiplier: 1,
      intensityAddition: 0.01
    });
  }

  apply(tower, intensity) {
    // Diminishing returns: reduces cooldown by intensity each time
    tower.cooldown = Math.max(20, tower.cooldown * intensity);
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, y + h * 0.2);
    ctx.lineTo(x + w * 0.7, y + h * 0.2);
    ctx.lineTo(x + w * 0.3, y + h * 0.8);
    ctx.lineTo(x + w * 0.7, y + h * 0.8);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
