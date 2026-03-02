import { Enemy } from './Enemy.js';

export class E030_TinySlowSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 8, maxHealth: 85, speed: 20, color: '#fff', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 9; }
  getScoreValue() { return 170; }
}
