import { TowerFeature } from './TowerFeature.js';

export class RangeFeature extends TowerFeature {
  constructor() {
    super({
      id: 'range',
      baseCost: 100,
      costMultiplier: 2.0,
      baseIntensity: 5,
      intensityMultiplier: 1,
      intensityAddition: 0,
      color: '#a0f',
      iconDef: {
        type: 'custom',
        draw: (ctx, w, h, color) => {
          ctx.beginPath();
          // Central circle
          ctx.arc(w / 2, h / 2, w * 0.15, 0, Math.PI * 2);
          
          // Top-left arrow
          ctx.moveTo(w * 0.35, h * 0.35);
          ctx.lineTo(w * 0.15, h * 0.15);
          ctx.lineTo(w * 0.15, h * 0.3);
          ctx.moveTo(w * 0.15, h * 0.15);
          ctx.lineTo(w * 0.3, h * 0.15);

          // Top-right arrow
          ctx.moveTo(w * 0.65, h * 0.35);
          ctx.lineTo(w * 0.85, h * 0.15);
          ctx.lineTo(w * 0.85, h * 0.3);
          ctx.moveTo(w * 0.85, h * 0.15);
          ctx.lineTo(w * 0.7, h * 0.15);

          // Bottom-left arrow
          ctx.moveTo(w * 0.35, h * 0.65);
          ctx.lineTo(w * 0.15, h * 0.85);
          ctx.lineTo(w * 0.15, h * 0.7);
          ctx.moveTo(w * 0.15, h * 0.85);
          ctx.lineTo(w * 0.3, h * 0.85);

          // Bottom-right arrow
          ctx.moveTo(w * 0.65, h * 0.65);
          ctx.lineTo(w * 0.85, h * 0.85);
          ctx.lineTo(w * 0.85, h * 0.7);
          ctx.moveTo(w * 0.85, h * 0.85);
          ctx.lineTo(w * 0.7, h * 0.85);

          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });
  }

  apply(tower, intensity) {
    tower.range += intensity;
    tower.highlightRangeTimer = 500;
  }

  purchase(tower, game) {
    if (game.currency >= this.cost) {
      game.currency -= this.cost;
      this.level++;
      this.apply(tower, this.intensity);
      
      // Super-exponential cost growth for range to prevent covering the whole screen
      // Cost grows as baseCost * (costMultiplier ^ (level * 1.5))
      this.cost = Math.floor(this.baseCost * Math.pow(this.costMultiplier, Math.pow(this.level, 1.5)));
      this.intensity = this.baseIntensity * Math.pow(this.intensityMultiplier, this.level) + (this.intensityAddition * this.level);
      return true;
    }
    return false;
  }
}
