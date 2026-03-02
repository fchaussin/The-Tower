import { Enemy } from './Enemy.js';

export class E043_GiantHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 34, maxHealth: 117, speed: 50, color: '#f80', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 234; }
}
