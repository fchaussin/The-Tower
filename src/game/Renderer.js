import { GAME_STATES } from './Game.js';
import { IconRenderer } from './IconRenderer.js';

export class Renderer {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    if (this.game.state === GAME_STATES.MENU) {
      return;
    }

    if (this.game.state === GAME_STATES.PLAYING || this.game.state === GAME_STATES.PAUSED || this.game.state === GAME_STATES.GAME_OVER || this.game.state === GAME_STATES.LIFE_LOST || this.game.state === GAME_STATES.GAME_OVER_TRANSITION) {
      this.drawFlashes();
      
      this.game.tower.drawBackground(this.ctx, this.game);
      this.game.enemies.forEach(e => e.draw(this.ctx));
      this.game.projectiles.forEach(p => p.draw(this.ctx));
      this.game.lightningEffects.forEach(c => c.draw(this.ctx));
      this.game.splashEffects.forEach(s => s.draw(this.ctx));
      this.game.shockwaves.forEach(s => s.draw(this.ctx));
      
      this.game.tower.drawForeground(this.ctx, this.game);
      
      this.game.textEffects.forEach(t => t.draw(this.ctx));
      
      this.drawHUD();
      this.drawUpgrades();
      this.drawControls();

      if (this.game.state === GAME_STATES.LIFE_LOST) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.game.width, this.game.height);
      }
    }
  }

  drawFlashes() {
    this.game.flashes.forEach(f => {
      this.ctx.globalAlpha = (f.life / f.maxLife) * 0.15;
      this.ctx.fillStyle = f.color;
      this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    });
    this.ctx.globalAlpha = 1.0;
  }

  drawHUD() {
    const ui = this.game.uiManager;
    
    // Lives (First line)
    this.ctx.fillStyle = '#f00';
    this.ctx.font = '20px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('♥', 30, 35);
    this.ctx.fillStyle = '#fff'; 
    this.ctx.textAlign = 'left'; 
    this.ctx.fillText(Math.max(0, this.game.lives), 50, 37);

    // Currency
    this.ctx.fillStyle = '#fd0';
    this.ctx.beginPath(); this.ctx.arc(30, 65, 12, 0, Math.PI*2); this.ctx.fill();
    this.ctx.fillStyle = '#000'; this.ctx.font = '14px monospace'; this.ctx.textAlign = 'center'; this.ctx.fillText('$', 30, 70);
    this.ctx.fillStyle = '#fff'; this.ctx.textAlign = 'left'; this.ctx.font = '20px monospace'; this.ctx.fillText(ui.formatNumber(this.game.currency), 50, 72);
    
    // Score
    this.ctx.fillStyle = '#0df';
    this.ctx.beginPath();
    for(let i=0; i<5; i++) {
      this.ctx.lineTo(30 + 12*Math.cos(-Math.PI/2 + i*2*Math.PI/5), 100 + 12*Math.sin(-Math.PI/2 + i*2*Math.PI/5));
      this.ctx.lineTo(30 + 5*Math.cos(-Math.PI/2 + (i+0.5)*2*Math.PI/5), 100 + 5*Math.sin(-Math.PI/2 + (i+0.5)*2*Math.PI/5));
    }
    this.ctx.closePath(); this.ctx.fill();
    this.ctx.fillStyle = '#fff'; this.ctx.fillText(ui.formatNumber(this.game.score), 50, 107);
    
    // Level & Wave
    this.ctx.fillStyle = '#f0f';
    this.ctx.beginPath();
    this.ctx.moveTo(30, 130); this.ctx.lineTo(35, 140); this.ctx.lineTo(25, 140);
    this.ctx.closePath(); this.ctx.fill();
    this.ctx.fillStyle = '#fff'; 
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Lvl ${this.game.level}`, 50, 142);
    
    if (this.game.totalWaves > 0) {
      this.ctx.font = '14px monospace';
      this.ctx.fillStyle = '#aaa';
      this.ctx.fillText(`Wave ${this.game.currentWave}/${this.game.totalWaves}`, 50, 157);
      
      // Difficulty indicator
      const diff = this.game.difficulty;
      const diffColor = diff === 'EASY' ? '#0f0' : (diff === 'HARD' ? '#f00' : '#ff0');
      this.ctx.fillStyle = diffColor;
      this.ctx.font = '12px monospace';
      this.ctx.fillText(diff, 50, 172);
    }
  }

  drawUpgrades() {
    const ui = this.game.uiManager;
    this.game.upgrades.forEach(upg => {
      let color = this.game.currency >= upg.cost ? upg.color : '#888';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(upg.box.x, upg.box.y, upg.box.w, upg.box.h);
      IconRenderer.drawIcon(this.ctx, upg, upg.box.x, upg.box.y, upg.box.w, upg.box.h, color);
      this.ctx.fillStyle = color;
      let fontSize = Math.max(10, Math.floor(upg.box.w * 0.28));
      this.ctx.font = `${fontSize}px monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ui.formatNumber(upg.cost), upg.box.x + upg.box.w / 2, upg.box.y + upg.box.h + fontSize + 4);

      // Draw level number in bottom right
      if (upg.level > 0) {
        const levelText = upg.level.toString();
        const levelFontSize = Math.floor(upg.box.w * 0.25);
        this.ctx.font = `bold ${levelFontSize}px monospace`;
        const textWidth = this.ctx.measureText(levelText).width;
        
        // Small background for readability
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(
          upg.box.x + upg.box.w - textWidth - 6, 
          upg.box.y + upg.box.h - levelFontSize - 4, 
          textWidth + 6, 
          levelFontSize + 4
        );

        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(levelText, upg.box.x + upg.box.w - 3, upg.box.y + upg.box.h - 2);
        this.ctx.textBaseline = 'alphabetic'; // Reset baseline
      }
    });
    this.ctx.textAlign = 'left';
  }

  drawControls() {
    const ui = this.game.uiManager;
    
    // Pause Box
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.game.pauseBox.x, this.game.pauseBox.y, this.game.pauseBox.w, this.game.pauseBox.h);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.game.pauseBox.x + 8, this.game.pauseBox.y + 8, 4, 14);
    this.ctx.fillRect(this.game.pauseBox.x + 18, this.game.pauseBox.y + 8, 4, 14);

    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(ui.formatTime(this.game.time), this.game.pauseBox.x + this.game.pauseBox.w / 2, this.game.pauseBox.y + this.game.pauseBox.h + 16);
    this.ctx.textAlign = 'left';

    // Sound Box
    this.ctx.strokeRect(this.game.soundBox.x, this.game.soundBox.y, this.game.soundBox.w, this.game.soundBox.h);
    this.ctx.beginPath();
    this.ctx.moveTo(this.game.soundBox.x + 8, this.game.soundBox.y + 12);
    this.ctx.lineTo(this.game.soundBox.x + 14, this.game.soundBox.y + 12);
    this.ctx.lineTo(this.game.soundBox.x + 20, this.game.soundBox.y + 6);
    this.ctx.lineTo(this.game.soundBox.x + 20, this.game.soundBox.y + 24);
    this.ctx.lineTo(this.game.soundBox.x + 14, this.game.soundBox.y + 18);
    this.ctx.lineTo(this.game.soundBox.x + 8, this.game.soundBox.y + 18);
    this.ctx.fill();
    if (!this.game.audioManager.soundEnabled) {
      this.ctx.strokeStyle = '#f00';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.game.soundBox.x + 5, this.game.soundBox.y + 5);
      this.ctx.lineTo(this.game.soundBox.x + 25, this.game.soundBox.y + 25);
      this.ctx.stroke();
    }
  }
}
