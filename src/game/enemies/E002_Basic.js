import { Enemy } from './Enemy.js';

export class E002_Basic extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 10, maxHealth: 3, speed: 50, color: '#f00', shape: 'square', style: 'fill' });
  }
}
