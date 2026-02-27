import { Enemy } from './Enemy.js';

export class E035_HollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 18, 97, 70, '#f08', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 194; }
}
