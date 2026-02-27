import { Enemy } from './Enemy.js';

export class E031_TinySlowHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 10, 87, 30, '#f80', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 174; }
}
