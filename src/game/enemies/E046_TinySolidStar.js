import { Enemy } from './Enemy.js';

export class E046_TinySolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 10, 125, 80, '#8f0', 'star', 'fill');
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 250; }
}
