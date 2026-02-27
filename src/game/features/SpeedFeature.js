import { TowerFeature } from './TowerFeature.js';

export class SpeedFeature extends TowerFeature {
  constructor() {
    super('speed', 5000);
  }

  apply(tower) {
    tower.projectileSpeed += 50;
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
