import { Enemy } from './Enemy.js';

export class E034_SmallSolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 16, maxHealth: 95, speed: 60, color: '#8f0', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 10; }
  getScoreValue() { return 190; }
}
