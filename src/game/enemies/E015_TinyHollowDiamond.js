import { Enemy } from './Enemy.js';

export class E015_TinyHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 8, 47, 70, '#ff0', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 94; }
}
