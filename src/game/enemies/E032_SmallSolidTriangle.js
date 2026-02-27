import { Enemy } from './Enemy.js';

export class E032_SmallSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 12, 90, 40, '#80f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 180; }
}
