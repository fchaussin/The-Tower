import { Enemy } from './Enemy.js';

export class E027_GiantFastHollowDiamond extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 32, maxHealth: 77, speed: 90, color: '#ff0', shape: 'diamond', style: 'stroke' });
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 154; }
}
