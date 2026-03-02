import { Enemy } from './Enemy.js';

export class E041_LargeSlowHollowHexagon extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 30, maxHealth: 112, speed: 30, color: '#0ff', shape: 'hexagon', style: 'stroke' });
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 224; }
}
