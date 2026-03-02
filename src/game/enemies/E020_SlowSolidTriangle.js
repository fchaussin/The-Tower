import { Enemy } from './Enemy.js';

export class E020_SlowSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 18, maxHealth: 60, speed: 20, color: '#80f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 120; }
}
