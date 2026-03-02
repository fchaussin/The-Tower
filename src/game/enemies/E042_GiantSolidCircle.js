import { Enemy } from './Enemy.js';

export class E042_GiantSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 32, maxHealth: 115, speed: 40, color: '#fff', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 230; }
}
