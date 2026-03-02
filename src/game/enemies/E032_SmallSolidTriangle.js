import { Enemy } from './Enemy.js';

export class E032_SmallSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 12, maxHealth: 90, speed: 40, color: '#80f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 180; }
}
