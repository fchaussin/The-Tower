import { Enemy } from './Enemy.js';

export class E028_GiantFastSolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 34, maxHealth: 80, speed: 100, color: '#f0f', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 160; }
}
