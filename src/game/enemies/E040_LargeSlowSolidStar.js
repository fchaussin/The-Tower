import { Enemy } from './Enemy.js';

export class E040_LargeSlowSolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 28, maxHealth: 110, speed: 20, color: '#f0f', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 220; }
}
