import { Enemy } from './Enemy.js';

export class E045_TinyHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 8, maxHealth: 122, speed: 70, color: '#08f', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 244; }
}
