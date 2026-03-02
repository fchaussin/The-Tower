import { Enemy } from './Enemy.js';

export class E049_SmallFastHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 16, maxHealth: 132, speed: 110, color: '#0f0', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 264; }
}
