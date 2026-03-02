import { Enemy } from './Enemy.js';

export class E056_LargeSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 30, maxHealth: 150, speed: 80, color: '#80f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 300; }
}
