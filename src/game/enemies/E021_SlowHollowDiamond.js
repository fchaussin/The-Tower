import { Enemy } from './Enemy.js';

export class E021_SlowHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 20, maxHealth: 62, speed: 30, color: '#08f', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 124; }
}
