import { Enemy } from './Enemy.js';

export class E055_LargeHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 28, maxHealth: 147, speed: 70, color: '#f80', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 294; }
}
