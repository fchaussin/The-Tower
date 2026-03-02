import { Enemy } from './Enemy.js';

export class E009_LargeFastHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 26, maxHealth: 32, speed: 110, color: '#08f', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 64; }
}
