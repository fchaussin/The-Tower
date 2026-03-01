import { TowerFeature } from './TowerFeature.js';

export class RangeFeature extends TowerFeature {
  constructor() {
    super({
      id: 'range',
      baseCost: 300,
      costMultiplier: 1.2,
      costAddition: 5,
      baseIntensity: 20,
      intensityMultiplier: 1,
      intensityAddition: 2,
      color: '#a0f'
    });
  }

  apply(tower, intensity) {
    tower.range += intensity;
    tower.highlightRangeTimer = 500;
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    // Central circle
    ctx.arc(x + w / 2, y + h / 2, w * 0.15, 0, Math.PI * 2);
    
    // Top-left arrow
    ctx.moveTo(x + w * 0.35, y + h * 0.35);
    ctx.lineTo(x + w * 0.15, y + h * 0.15);
    ctx.lineTo(x + w * 0.15, y + h * 0.3);
    ctx.moveTo(x + w * 0.15, y + h * 0.15);
    ctx.lineTo(x + w * 0.3, y + h * 0.15);

    // Top-right arrow
    ctx.moveTo(x + w * 0.65, y + h * 0.35);
    ctx.lineTo(x + w * 0.85, y + h * 0.15);
    ctx.lineTo(x + w * 0.85, y + h * 0.3);
    ctx.moveTo(x + w * 0.85, y + h * 0.15);
    ctx.lineTo(x + w * 0.7, y + h * 0.15);

    // Bottom-left arrow
    ctx.moveTo(x + w * 0.35, y + h * 0.65);
    ctx.lineTo(x + w * 0.15, y + h * 0.85);
    ctx.lineTo(x + w * 0.15, y + h * 0.7);
    ctx.moveTo(x + w * 0.15, y + h * 0.85);
    ctx.lineTo(x + w * 0.3, y + h * 0.85);

    // Bottom-right arrow
    ctx.moveTo(x + w * 0.65, y + h * 0.65);
    ctx.lineTo(x + w * 0.85, y + h * 0.85);
    ctx.lineTo(x + w * 0.85, y + h * 0.7);
    ctx.moveTo(x + w * 0.85, y + h * 0.85);
    ctx.lineTo(x + w * 0.7, y + h * 0.85);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
