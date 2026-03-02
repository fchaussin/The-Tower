import { Enemy } from './Enemy.js';

export class E053_HollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 24, maxHealth: 142, speed: 50, color: '#0ff', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 284; }
}
