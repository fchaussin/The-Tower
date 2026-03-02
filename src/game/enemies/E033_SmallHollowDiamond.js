import { Enemy } from './Enemy.js';

export class E033_SmallHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 14, maxHealth: 92, speed: 50, color: '#08f', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 184; }
}
