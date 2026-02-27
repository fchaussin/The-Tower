import { Enemy } from './Enemy.js';

export class E045_TinyHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 8, 122, 70, '#08f', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 244; }
}
