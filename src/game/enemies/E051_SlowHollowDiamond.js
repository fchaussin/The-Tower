import { Enemy } from './Enemy.js';

export class E051_SlowHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 20, maxHealth: 137, speed: 30, color: '#ff0', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 274; }
}
