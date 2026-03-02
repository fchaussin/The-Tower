import { Enemy } from './Enemy.js';

export class E050_SlowSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 18, maxHealth: 135, speed: 20, color: '#00f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 270; }
}
