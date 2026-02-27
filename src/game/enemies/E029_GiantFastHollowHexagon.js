import { Enemy } from './Enemy.js';

export class E029_GiantFastHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 36, 82, 110, '#0ff', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 164; }
}
