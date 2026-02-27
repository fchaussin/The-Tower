import { Enemy } from './Enemy.js';

export class E051_SlowHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 20, 137, 30, '#ff0', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 274; }
}
