import { Enemy } from './Enemy.js';

export class E044_GiantSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 36, 120, 60, '#80f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 240; }
}
