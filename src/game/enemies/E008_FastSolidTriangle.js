import { Enemy } from './Enemy.js';

export class E008_FastSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 24, 40, 100, '#80f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 3; }
  getScoreValue() { return 60; }
}
