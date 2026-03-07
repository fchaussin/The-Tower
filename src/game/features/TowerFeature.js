import { IconRenderer } from '../IconRenderer.js';

export class TowerFeature {
  constructor({
    id,
    baseCost,
    costMultiplier = 1.15,
    baseIntensity = 1,
    intensityMultiplier = 1,
    intensityAddition = 0,
    color = '#fff',
    iconDef = null
  }) {
    this.id = id;
    this.color = color;
    this.baseCost = baseCost;
    this.costMultiplier = costMultiplier;
    this.baseIntensity = baseIntensity;
    this.intensityMultiplier = intensityMultiplier;
    this.intensityAddition = intensityAddition;
    this.level = 0;
    this.cost = baseCost;
    this.intensity = baseIntensity;
    this.box = { x: 0, y: 0, w: 50, h: 50 };
    this.iconDef = iconDef;
  }

  apply(tower, intensity) {
    // To be implemented by subclasses
  }

  purchase(tower, game) {
    if (game.currency >= this.cost) {
      game.currency -= this.cost;
      this.level++;
      this.apply(tower, this.intensity);
      
      // Calculate next cost and intensity using exponential math
      this.cost = Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
      this.intensity = this.baseIntensity * Math.pow(this.intensityMultiplier, this.level) + (this.intensityAddition * this.level);
      return true;
    }
    return false;
  }

  draw(ctx, x, y, w, h, color) {
    if (this.iconDef) {
      IconRenderer.render(ctx, this.iconDef, x, y, w, h, color);
    }
  }
}
