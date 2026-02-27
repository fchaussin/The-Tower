import { Enemy } from './Enemy.js';

export class E039_LargeFastHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 26, 107, 110, '#ff0', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 214; }
}
