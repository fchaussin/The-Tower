export class TowerFeature {
  constructor({
    id,
    baseCost,
    costMultiplier = 1.1,
    costAddition = 2,
    baseIntensity = 1,
    intensityMultiplier = 1,
    intensityAddition = 0,
    color = '#fff'
  }) {
    this.id = id;
    this.color = color;
    this.cost = baseCost;
    this.costMultiplier = costMultiplier;
    this.costAddition = costAddition;
    this.intensity = baseIntensity;
    this.intensityMultiplier = intensityMultiplier;
    this.intensityAddition = intensityAddition;
    this.level = 0;
    this.box = { x: 0, y: 0, w: 50, h: 50 };
  }

  apply(tower, intensity) {
    // To be implemented by subclasses
  }

  purchase(tower, game) {
    if (game.currency >= this.cost) {
      game.currency -= this.cost;
      this.level++;
      this.apply(tower, this.intensity);
      this.cost = Math.floor(this.cost * this.costMultiplier) + this.costAddition;
      this.intensity = (this.intensity * this.intensityMultiplier) + this.intensityAddition;
      return true;
    }
    return false;
  }

  draw(ctx, x, y, w, h, color) {
    // To be implemented by subclasses
  }
}
