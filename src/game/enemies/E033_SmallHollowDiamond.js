import { Enemy } from './Enemy.js';

export class E033_SmallHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 14, 92, 50, '#08f', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 184; }
}
