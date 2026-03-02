import { Enemy } from './Enemy.js';

export class E010_LargeSlowSolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 28, maxHealth: 35, speed: 20, color: '#8f0', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 70; }
}
