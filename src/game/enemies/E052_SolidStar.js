import { Enemy } from './Enemy.js';

export class E052_SolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 22, maxHealth: 140, speed: 40, color: '#f0f', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 14; }
  getScoreValue() { return 280; }
}
