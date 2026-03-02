import { Enemy } from './Enemy.js';

export class E011_LargeSlowHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 30, maxHealth: 37, speed: 30, color: '#f08', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 74; }
}
