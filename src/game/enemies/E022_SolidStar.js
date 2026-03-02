import { Enemy } from './Enemy.js';

export class E022_SolidStar extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 22, maxHealth: 65, speed: 40, color: '#8f0', shape: 'star', style: 'fill' });
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 130; }
}
