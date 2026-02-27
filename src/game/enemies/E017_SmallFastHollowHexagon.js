import { Enemy } from './Enemy.js';

export class E017_SmallFastHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 12, 52, 90, '#0ff', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 104; }
}
