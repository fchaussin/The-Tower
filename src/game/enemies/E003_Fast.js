import { Enemy } from './Enemy.js';

export class E003_Fast extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 8, 2, 100, '#ff0', 'triangle', 'stroke');
  }
  getCurrencyValue() { return 2; }
  getScoreValue() { return 15; }
}
