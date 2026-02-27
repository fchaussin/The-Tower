import { Enemy } from './Enemy.js';

export class E042_GiantSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 32, 115, 40, '#fff', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 230; }
}
