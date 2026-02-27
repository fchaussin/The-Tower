import { Enemy } from './Enemy.js';

export class E048_SmallFastSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 14, 130, 100, '#f00', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 260; }
}
