import { Enemy } from './Enemy.js';

export class E028_GiantFastSolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 34, 80, 100, '#f0f', 'star', 'fill');
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 160; }
}
