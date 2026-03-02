import { Enemy } from './Enemy.js';

export class E003_Fast extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 8, maxHealth: 3, speed: 100, color: '#ff0', shape: 'triangle', style: 'stroke' });
  }
  getCurrencyValue() { return 2; }
  getScoreValue() { return 15; }
}
