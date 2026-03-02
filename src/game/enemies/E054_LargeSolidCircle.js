import { Enemy } from './Enemy.js';

export class E054_LargeSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 26, maxHealth: 145, speed: 60, color: '#fff', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 15; }
  getScoreValue() { return 290; }
}
