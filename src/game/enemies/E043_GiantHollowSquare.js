import { Enemy } from './Enemy.js';

export class E043_GiantHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 34, 117, 50, '#f80', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 234; }
}
