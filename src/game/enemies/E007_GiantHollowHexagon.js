import { Enemy } from './Enemy.js';

export class E007_GiantHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 35, maxHealth: 60, speed: 15, color: '#80f', shape: 'hexagon', style: 'stroke' });
  }

  getCurrencyValue() { return 30; }
  getScoreValue() { return 150; }
}
