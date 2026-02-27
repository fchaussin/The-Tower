import { Enemy } from './Enemy.js';

export class E034_SmallSolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 16, 95, 60, '#8f0', 'star', 'fill');
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 190; }
}
