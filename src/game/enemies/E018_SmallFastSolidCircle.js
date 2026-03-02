import { Enemy } from './Enemy.js';

export class E018_SmallFastSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 14, maxHealth: 55, speed: 100, color: '#fff', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 6; }
  getScoreValue() { return 110; }
}
