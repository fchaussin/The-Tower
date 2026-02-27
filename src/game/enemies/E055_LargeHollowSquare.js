import { Enemy } from './Enemy.js';

export class E055_LargeHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 28, 147, 70, '#f80', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 294; }
}
