import { Enemy } from './Enemy.js';

export class E014_GiantSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 36, maxHealth: 45, speed: 60, color: '#00f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 5; }
  getScoreValue() { return 90; }
}
