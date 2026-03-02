import { Enemy } from './Enemy.js';

export class E015_TinyHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 8, maxHealth: 47, speed: 70, color: '#ff0', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 94; }
}
