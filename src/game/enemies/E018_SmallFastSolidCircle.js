import { Enemy } from './Enemy.js';

export class E018_SmallFastSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 14, 55, 100, '#fff', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 110; }
}
