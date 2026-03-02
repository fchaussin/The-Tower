import { Enemy } from './Enemy.js';

export class E047_SmallFastHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 12, maxHealth: 127, speed: 90, color: '#f08', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 254; }
}
