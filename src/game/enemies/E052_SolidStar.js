import { Enemy } from './Enemy.js';

export class E052_SolidStar extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 22, 140, 40, '#f0f', 'star', 'fill');
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 280; }
}
