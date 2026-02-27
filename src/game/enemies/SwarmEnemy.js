import { Enemy } from './Enemy.js';

export class SwarmEnemy extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 8, 1, 60, '#f0f', 'circle', 'fill');
  }

  getCurrencyValue() { return 1; }
  getScoreValue() { return 5; }
}
