import { Enemy } from './Enemy.js';

export class E006_Tank extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 18, 25, 20, '#00f', 'hexagon', 'fill');
  }
  getCurrencyValue() { return 5; }
  getScoreValue() { return 50; }
}
