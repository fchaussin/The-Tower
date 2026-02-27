import { Enemy } from './Enemy.js';
import { BasicEnemy } from './BasicEnemy.js';

export class SplitterEnemy extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, 14, 6, 40, '#a0f', 'diamond', 'stroke');
  }
  die(game) {
    super.die(game);
    let e1 = new BasicEnemy(this.x + 15, this.y + 15, this.targetX, this.targetY);
    let e2 = new BasicEnemy(this.x - 15, this.y - 15, this.targetX, this.targetY);
    game.enemies.push(e1, e2);
  }
  getCurrencyValue() { return 3; }
  getScoreValue() { return 30; }
}
