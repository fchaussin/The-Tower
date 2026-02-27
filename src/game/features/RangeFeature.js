import { TowerFeature } from './TowerFeature.js';

export class RangeFeature extends TowerFeature {
  constructor() {
    super('range', 50000);
  }

  apply(tower) {
    tower.range += 20;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.3, 0, Math.PI * 2);
    ctx.moveTo(x + w / 2, y + h * 0.1);
    ctx.lineTo(x + w / 2, y + h * 0.9);
    ctx.moveTo(x + w * 0.1, y + h / 2);
    ctx.lineTo(x + w * 0.9, y + h / 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
