import { Enemy } from './Enemy.js';

export class E026_LargeSolidTriangle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 30, maxHealth: 75, speed: 80, color: '#00f', shape: 'triangle', style: 'fill' });
  }
  
  getCurrencyValue() { return 8; }
  getScoreValue() { return 150; }
}
