import { Enemy } from './Enemy.js';

export class E007_GiantHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 35, 60, 15, '#80f', 'hexagon', 'stroke');
  }

  getCurrencyValue() { return 30; }
  getScoreValue() { return 150; }
}
