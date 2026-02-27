import { Enemy } from './Enemy.js';

export class E049_SmallFastHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 16, 132, 110, '#0f0', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 264; }
}
