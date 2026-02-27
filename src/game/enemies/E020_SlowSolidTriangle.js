import { Enemy } from './Enemy.js';

export class E020_SlowSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 18, 60, 20, '#80f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 120; }
}
