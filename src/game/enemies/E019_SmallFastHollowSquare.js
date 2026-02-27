import { Enemy } from './Enemy.js';

export class E019_SmallFastHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 16, 57, 110, '#f80', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 114; }
}
