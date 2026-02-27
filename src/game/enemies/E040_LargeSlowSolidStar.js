import { Enemy } from './Enemy.js';

export class E040_LargeSlowSolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 28, 110, 20, '#f0f', 'star', 'fill');
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 220; }
}
