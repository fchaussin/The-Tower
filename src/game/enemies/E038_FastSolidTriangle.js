import { Enemy } from './Enemy.js';

export class E038_FastSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 24, 105, 100, '#00f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 210; }
}
