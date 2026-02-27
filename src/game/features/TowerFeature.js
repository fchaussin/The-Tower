export class TowerFeature {
  constructor(id, baseCost) {
    this.id = id;
    this.cost = baseCost;
    this.box = { x: 0, y: 0, w: 50, h: 50 };
  }

  apply(tower) {
    // To be implemented by subclasses
  }

  purchase(tower, game) {
    if (game.currency >= this.cost) {
      game.currency -= this.cost;
      this.apply(tower);
      this.cost = Math.floor(this.cost * 1.8) + 5;
      return true;
    }
    return false;
  }

  draw(ctx, x, y, w, h, color) {
    // To be implemented by subclasses
  }
}
