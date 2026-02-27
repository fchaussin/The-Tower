import { Enemy } from './Enemy.js';

export class E026_LargeSolidTriangle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 30, 75, 80, '#00f', 'triangle', 'fill');
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 150; }
}
