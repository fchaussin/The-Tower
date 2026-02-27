import { Enemy } from './Enemy.js';

export class E047_SmallFastHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 12, 127, 90, '#f08', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 254; }
}
