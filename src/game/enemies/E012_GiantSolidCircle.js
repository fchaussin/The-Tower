import { Enemy } from './Enemy.js';

export class E012_GiantSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 32, maxHealth: 40, speed: 40, color: '#f00', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 4; }
  getScoreValue() { return 80; }
}
