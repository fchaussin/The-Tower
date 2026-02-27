export class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.markedForDeletion = false;
  }
  update(dt, game) {}
  draw(ctx) {}
}
