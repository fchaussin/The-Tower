import { Enemy } from './Enemy.js';

export class E036_SolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 20, maxHealth: 100, speed: 80, color: '#f00', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 200; }
}
