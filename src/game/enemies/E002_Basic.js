import { Enemy } from './Enemy.js';

export class E002_Basic extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 10, 3, 50, '#f00', 'square', 'fill');
  }
}
