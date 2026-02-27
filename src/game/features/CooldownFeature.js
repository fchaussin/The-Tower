import { TowerFeature } from './TowerFeature.js';

export class CooldownFeature extends TowerFeature {
  constructor() {
    super('cooldown', 500);
  }

  apply(tower) {
    tower.cooldown = Math.max(50, tower.cooldown - 50);
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
