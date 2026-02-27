import { Enemy } from './Enemy.js';

export class E025_LargeHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 28, 72, 70, '#0f0', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 144; }
}
