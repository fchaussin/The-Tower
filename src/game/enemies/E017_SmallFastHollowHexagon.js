import { Enemy } from './Enemy.js';

export class E017_SmallFastHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 12, maxHealth: 52, speed: 90, color: '#0ff', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 104; }
}
