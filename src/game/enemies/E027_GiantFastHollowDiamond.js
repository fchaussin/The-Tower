import { Enemy } from './Enemy.js';

export class E027_GiantFastHollowDiamond extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 32, 77, 90, '#ff0', 'diamond', 'stroke');
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 154; }
}
