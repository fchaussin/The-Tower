import { Enemy } from './Enemy.js';

export class E016_TinySolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 10, maxHealth: 50, speed: 80, color: '#f0f', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 100; }
}
