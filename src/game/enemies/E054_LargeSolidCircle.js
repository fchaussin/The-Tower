import { Enemy } from './Enemy.js';

export class E054_LargeSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 26, 145, 60, '#fff', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 290; }
}
