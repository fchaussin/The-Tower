import { Enemy } from './Enemy.js';

export class E006_Tank extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 18, maxHealth: 30, speed: 20, color: '#00f', shape: 'hexagon', style: 'fill' });
  }
  getCurrencyValue() { return 5; }
  getScoreValue() { return 50; }
}
