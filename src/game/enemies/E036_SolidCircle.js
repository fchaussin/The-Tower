import { Enemy } from './Enemy.js';

export class E036_SolidCircle extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 20, 100, 80, '#f00', 'circle', 'fill');
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 200; }
}
