import { Enemy } from './Enemy.js';

export class E005_Rage extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 12, 10, 35, '#f80', 'star', 'fill');
    this.enraged = false;
  }
  update(dt, game) {
    if (!this.enraged && this.health <= this.maxHealth / 2) {
      this.enraged = true;
      this.speed *= 2.5;
      this.color = '#f00';
      this.updateVelocity();
    }
    super.update(dt, game);
  }
  getCurrencyValue() { return 4; }
  getScoreValue() { return 40; }
}
