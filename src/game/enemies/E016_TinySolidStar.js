import { Enemy } from './Enemy.js';

export class E016_TinySolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 10, 50, 80, '#f0f', 'star', 'fill');
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 100; }
}
