import { Enemy } from './Enemy.js';

export class E023_HollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 24, maxHealth: 67, speed: 50, color: '#f08', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 134; }
}
