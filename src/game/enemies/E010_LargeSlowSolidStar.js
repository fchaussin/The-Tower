import { Enemy } from './Enemy.js';

export class E010_LargeSlowSolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 28, 35, 20, '#8f0', 'star', 'fill');
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 70; }
}
