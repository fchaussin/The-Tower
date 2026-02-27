import { Enemy } from './Enemy.js';

export class E022_SolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 22, 65, 40, '#8f0', 'star', 'fill');
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 130; }
}
