import { Enemy } from './Enemy.js';

export class E039_LargeFastHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 26, maxHealth: 107, speed: 110, color: '#ff0', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 214; }
}
