import { TowerFeature } from './TowerFeature.js';

export class SplashFeature extends TowerFeature {
  constructor() {
    super({
      id: 'splash',
      baseCost: 50,
      costMultiplier: 1.5,
      costAddition: 25,
      baseIntensity: 1.0,
      intensityMultiplier: 1,
      intensityAddition: 0.5,
      color: '#f80'
    });
  }

  apply(tower, intensity) {
    tower.splashRadius = (tower.splashRadius || 0) + 10;
    tower.splashDamage = (tower.splashDamage || 0) + intensity;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 16, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
}
