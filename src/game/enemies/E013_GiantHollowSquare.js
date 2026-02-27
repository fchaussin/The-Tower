import { Enemy } from './Enemy.js';

export class E013_GiantHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 34, 42, 50, '#0f0', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 84; }
}
