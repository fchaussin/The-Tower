import { Enemy } from './Enemy.js';
import { E002_Basic } from './E002_Basic.js';

export class E004_Splitter extends Enemy {
  constructor({ x, y, targetX, targetY }) {
    super({ x, y, targetX, targetY, radius: 14, maxHealth: 6, speed: 40, color: '#a0f', shape: 'diamond', style: 'stroke' });
  }
  die(game) {
    super.die(game);
    let e1 = new E002_Basic({ x: this.x + 15, y: this.y + 15, targetX: this.targetX, targetY: this.targetY });
    let e2 = new E002_Basic({ x: this.x - 15, y: this.y - 15, targetX: this.targetX, targetY: this.targetY });
    game.enemies.push(e1, e2);
  }
  getCurrencyValue() { return 3; }
  getScoreValue() { return 30; }
}
