import { Enemy } from './Enemy.js';

export class E038_FastSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 24, maxHealth: 105, speed: 100, color: '#00f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 11; }
  getScoreValue() { return 210; }
}
