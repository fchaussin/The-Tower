import { Enemy } from './Enemy.js';

export class E048_SmallFastSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 14, maxHealth: 130, speed: 100, color: '#f00', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 13; }
  getScoreValue() { return 260; }
}
