import { Enemy } from './Enemy.js';

export class E013_GiantHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 34, maxHealth: 42, speed: 50, color: '#0f0', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 84; }
}
