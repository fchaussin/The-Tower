export class Renderer {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    if (this.game.state === 'MENU') {
      return;
    }

    if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED' || this.game.state === 'GAME_OVER') {
      this.drawFlashes();
      
      this.game.tower.draw(this.ctx, this.game);
      this.game.enemies.forEach(e => e.draw(this.ctx));
      this.game.projectiles.forEach(p => p.draw(this.ctx));
      this.game.chainEffects.forEach(c => c.draw(this.ctx));
      this.game.shockwaves.forEach(s => s.draw(this.ctx));
      this.game.textEffects.forEach(t => t.draw(this.ctx));
      
      this.drawHUD();
      this.drawUpgrades();
      this.drawControls();

      if (this.game.state === 'PAUSED') {
        this.drawPauseMenu();
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
    
    // Currency
    this.ctx.fillStyle = '#fd0';
    this.ctx.beginPath(); this.ctx.arc(30, 30, 12, 0, Math.PI*2); this.ctx.fill();
    this.ctx.fillStyle = '#000'; this.ctx.font = '14px monospace'; this.ctx.textAlign = 'center'; this.ctx.fillText('$', 30, 35);
    this.ctx.fillStyle = '#fff'; this.ctx.textAlign = 'left'; this.ctx.font = '20px monospace'; this.ctx.fillText(ui.formatNumber(this.game.currency), 50, 37);
    
    // Score
    this.ctx.fillStyle = '#0df';
    this.ctx.beginPath();
    for(let i=0; i<5; i++) {
      this.ctx.lineTo(30 + 12*Math.cos(-Math.PI/2 + i*2*Math.PI/5), 65 + 12*Math.sin(-Math.PI/2 + i*2*Math.PI/5));
      this.ctx.lineTo(30 + 5*Math.cos(-Math.PI/2 + (i+0.5)*2*Math.PI/5), 65 + 5*Math.sin(-Math.PI/2 + (i+0.5)*2*Math.PI/5));
    }
    this.ctx.closePath(); this.ctx.fill();
    this.ctx.fillStyle = '#fff'; this.ctx.fillText(ui.formatNumber(this.game.score), 50, 72);
    
    // Level
    this.ctx.fillStyle = '#f0f';
    this.ctx.beginPath();
    this.ctx.moveTo(30, 95); this.ctx.lineTo(35, 105); this.ctx.lineTo(25, 105);
    this.ctx.closePath(); this.ctx.fill();
    this.ctx.fillStyle = '#fff'; this.ctx.fillText(this.game.level, 50, 107);
  }

  drawUpgrades() {
    const ui = this.game.uiManager;
    this.game.upgrades.forEach(upg => {
      let color = this.game.currency >= upg.cost ? upg.color : '#888';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(upg.box.x, upg.box.y, upg.box.w, upg.box.h);
      upg.draw(this.ctx, upg.box.x, upg.box.y, upg.box.w, upg.box.h, color);
      this.ctx.fillStyle = color;
      let fontSize = Math.max(10, Math.floor(upg.box.w * 0.28));
      this.ctx.font = `${fontSize}px monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ui.formatNumber(upg.cost), upg.box.x + upg.box.w / 2, upg.box.y + upg.box.h + fontSize + 4);
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

    // Help Box
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.game.helpBox.x, this.game.helpBox.y, this.game.helpBox.w, this.game.helpBox.h);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('?', this.game.helpBox.x + this.game.helpBox.w / 2, this.game.helpBox.y + this.game.helpBox.h / 2);
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.textAlign = 'left';
  }

  drawPauseMenu() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.game.width / 2, this.game.height / 2 - 140);
    
    let cx = this.game.width / 2;
    let cy = this.game.height / 2;
    
    this.ctx.font = '24px monospace';

    // Resume (Accent #0cf)
    this.ctx.strokeStyle = '#0cf'; // Accent
    this.ctx.fillStyle = '#0cf';   // Accent
    this.ctx.strokeRect(cx - 100, cy - 90, 200, 40);
    this.ctx.fillText('Resume', cx, cy - 62);
    
    // Autres boutons (Blanc)
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#fff';
    
    // Reset
    this.ctx.strokeRect(cx - 100, cy - 30, 200, 40);
    this.ctx.fillText('Reset', cx, cy - 2);
    
    // Fullscreen
    this.ctx.strokeRect(cx - 100, cy + 30, 200, 40);
    const fsText = document.fullscreenElement ? 'No Fullscreen' : 'Fullscreen';
    this.ctx.fillText(fsText, cx, cy + 58);
    
    // Quit
    this.ctx.strokeRect(cx - 100, cy + 90, 200, 40);
    this.ctx.fillText('Exit', cx, cy + 118);
    
    this.ctx.textAlign = 'left';
  }
}
