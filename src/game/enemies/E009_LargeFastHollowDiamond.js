import { Enemy } from './Enemy.js';

export class E009_LargeFastHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 26, 32, 110, '#08f', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 64; }
}
