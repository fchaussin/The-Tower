import { Enemy } from './Enemy.js';

export class E037_FastHollowSquare extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 22, 102, 90, '#0f0', 'square', 'stroke');
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 204; }
}
