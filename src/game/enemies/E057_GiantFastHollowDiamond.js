import { Enemy } from './Enemy.js';

export class E057_GiantFastHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 32, maxHealth: 152, speed: 90, color: '#08f', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 16; }
  getScoreValue() { return 304; }
}
