import { Enemy } from './Enemy.js';
import { E002_Basic } from './E002_Basic.js';

export class E004_Splitter extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 14, 6, 40, '#a0f', 'diamond', 'stroke');
  }
  die(game) {
    super.die(game);
    let e1 = new E002_Basic(this.x + 15, this.y + 15, this.targetX, this.targetY);
    let e2 = new E002_Basic(this.x - 15, this.y - 15, this.targetX, this.targetY);
    game.enemies.push(e1, e2);
  }
  getCurrencyValue() { return 3; }
  getScoreValue() { return 30; }
}
