import { Enemy } from './Enemy.js';

export class E037_FastHollowSquare extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 22, maxHealth: 102, speed: 90, color: '#0f0', shape: 'square', style: 'stroke' });
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 204; }
}
