import { Enemy } from './Enemy.js';

export class E057_GiantFastHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 32, 152, 90, '#08f', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 16; }
  getScoreValue() { return 304; }
}
