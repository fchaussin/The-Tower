import { Enemy } from './Enemy.js';

export class E044_GiantSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 36, maxHealth: 120, speed: 60, color: '#80f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 240; }
}
