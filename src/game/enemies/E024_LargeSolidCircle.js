import { Enemy } from './Enemy.js';

export class E024_LargeSolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 26, 70, 60, '#f00', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 140; }
}
