import { Enemy } from './Enemy.js';

export class E030_TinySlowSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 8, 85, 20, '#fff', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 170; }
}
