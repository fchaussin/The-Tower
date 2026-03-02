import { Enemy } from './Enemy.js';

export class E029_GiantFastHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 36, maxHealth: 82, speed: 110, color: '#0ff', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 164; }
}
