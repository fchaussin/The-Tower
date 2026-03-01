import { TowerFeature } from './TowerFeature.js';

export class CooldownFeature extends TowerFeature {
  constructor() {
    super({
      id: 'cooldown',
      baseCost: 20,
      costMultiplier: 1.3,
      costAddition: 5,
      baseIntensity: 0.85,
      intensityMultiplier: 1,
      intensityAddition: 0.01,
      color: '#fff'
    });
  }

  apply(tower, intensity) {
    // Diminishing returns: reduces cooldown by intensity each time
    tower.cooldown = Math.max(20, tower.cooldown * intensity);
  }

  draw(ctx, x, y, w, h, color) {
    ctx.beginPath();
    // Top and bottom caps
    ctx.moveTo(x + w * 0.25, y + h * 0.15);
    ctx.lineTo(x + w * 0.75, y + h * 0.15);
    ctx.moveTo(x + w * 0.25, y + h * 0.85);
    ctx.lineTo(x + w * 0.75, y + h * 0.85);
    
    // Glass
    ctx.moveTo(x + w * 0.3, y + h * 0.15);
    ctx.lineTo(x + w * 0.7, y + h * 0.15);
    ctx.lineTo(x + w * 0.5, y + h * 0.5);
    ctx.lineTo(x + w * 0.7, y + h * 0.85);
    ctx.lineTo(x + w * 0.3, y + h * 0.85);
    ctx.lineTo(x + w * 0.5, y + h * 0.5);
    ctx.closePath();
    
    // Sand (bottom)
    ctx.moveTo(x + w * 0.35, y + h * 0.75);
    ctx.lineTo(x + w * 0.65, y + h * 0.75);
    
    // Falling sand
    ctx.moveTo(x + w * 0.5, y + h * 0.5);
    ctx.lineTo(x + w * 0.5, y + h * 0.75);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
