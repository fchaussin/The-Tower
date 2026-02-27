import { Enemy } from './Enemy.js';

export class E023_HollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 24, 67, 50, '#f08', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 134; }
}
