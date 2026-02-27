import { Enemy } from './Enemy.js';

export class E041_LargeSlowHollowHexagon extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 30, 112, 30, '#0ff', 'hexagon', 'stroke');
  }
  
  getCurrencyValue() { return 12; }
  getScoreValue() { return 224; }
}
