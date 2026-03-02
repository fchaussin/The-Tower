import { Enemy } from './Enemy.js';

export class E025_LargeHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 28, maxHealth: 72, speed: 70, color: '#0f0', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 144; }
}
