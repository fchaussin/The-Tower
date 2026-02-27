import { Enemy } from './Enemy.js';

export class E021_SlowHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 20, 62, 30, '#08f', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 124; }
}
