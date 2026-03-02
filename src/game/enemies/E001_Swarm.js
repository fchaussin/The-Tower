import { Enemy } from './Enemy.js';

export class E001_Swarm extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 8, maxHealth: 1, speed: 60, color: '#f0f', shape: 'circle', style: 'fill' });
  }

  getCurrencyValue() { return 1; }
  getScoreValue() { return 5; }
}
