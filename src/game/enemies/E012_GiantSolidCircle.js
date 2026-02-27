import { Enemy } from './Enemy.js';

export class E012_GiantSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 32, 40, 40, '#f00', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 80; }
}
