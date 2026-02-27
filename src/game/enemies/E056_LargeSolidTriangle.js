import { Enemy } from './Enemy.js';

export class E056_LargeSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 30, 150, 80, '#80f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 300; }
}
