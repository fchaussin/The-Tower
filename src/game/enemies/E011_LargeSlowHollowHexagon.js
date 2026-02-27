import { Enemy } from './Enemy.js';

export class E011_LargeSlowHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 30, 37, 30, '#f08', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 74; }
}
