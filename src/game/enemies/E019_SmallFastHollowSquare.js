import { Enemy } from './Enemy.js';

export class E019_SmallFastHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 16, maxHealth: 57, speed: 110, color: '#f80', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 114; }
}
