import { Enemy } from './Enemy.js';

export class E046_TinySolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 10, maxHealth: 125, speed: 80, color: '#8f0', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 250; }
}
