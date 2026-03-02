import { Enemy } from './Enemy.js';

export class E024_LargeSolidCircle extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 26, maxHealth: 70, speed: 60, color: '#f00', shape: 'circle', style: 'fill' });
  }
  
  getCurrencyValue() { return 7; }
  getScoreValue() { return 140; }
}
