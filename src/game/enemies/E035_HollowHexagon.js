import { Enemy } from './Enemy.js';

export class E035_HollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 18, maxHealth: 97, speed: 70, color: '#f08', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 194; }
}
