import { Enemy } from './Enemy.js';

export class E014_GiantSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 36, 45, 60, '#00f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 90; }
}
