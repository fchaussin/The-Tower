import { Enemy } from './Enemy.js';

export class E031_TinySlowHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 10, maxHealth: 87, speed: 30, color: '#f80', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 174; }
}
