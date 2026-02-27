import { Enemy } from './Enemy.js';

export class E053_HollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 24, 142, 50, '#0ff', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 284; }
}
