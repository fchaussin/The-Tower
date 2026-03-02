import { Enemy } from './Enemy.js';

export class E008_FastSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 24, maxHealth: 40, speed: 100, color: '#80f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 3; }
  getScoreValue() { return 60; }
}
