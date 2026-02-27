import { Enemy } from './Enemy.js';

export class E050_SlowSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 18, 135, 20, '#00f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 270; }
}
