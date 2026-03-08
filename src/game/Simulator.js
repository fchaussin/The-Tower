import { GAME_STATES } from './Game.js';

export class Simulator {
  static run(game, targetLevel = 50) {
    console.log(`%c[SIMULATOR] Starting Headless Run to Level ${targetLevel}...`, 'color: #0df; font-weight: bold;');
    game.isHeadless = true;
    const startTime = performance.now();

    // Mute audio to prevent spam
    const originalPlaySound = game.audioManager.playSound;
    const originalPlayExplosion = game.audioManager.playExplosion;
    const originalPlayShoot = game.audioManager.playShoot;
    game.audioManager.playSound = () => {};
    game.audioManager.playExplosion = () => {};
    game.audioManager.playShoot = () => {};

    // Reset and start
    game.reset();
    game.updateState(GAME_STATES.PLAYING);

    let virtualTime = game.time;
    const timeStep = 16 / 1000; // 16ms in seconds
    let loops = 0;
    const maxLoops = 1000000; // Prevent infinite loops (approx 4.5 hours of virtual time)

    // Priority list for auto-buying upgrades
    const priorities = ['damage', 'cooldown', 'splash', 'speed', 'lightning', 'range', 'poison', 'slow'];

    while (game.lives > 0 && game.level <= targetLevel && loops < maxLoops) {
      game.update(timeStep);
      virtualTime += timeStep * 1000;

      // Debugging Level 8
      if (game.level === 8 && loops % 1000 === 0) {
        console.log(`[SIMULATOR] Level 8 Debug: Enemies=${game.enemies.length}, Lives=${game.lives}, Currency=${game.currency}, TowerDmg=${game.tower.damage.toFixed(1)}`);
      }

      // Auto-buy logic
      let bought;
      do {
        bought = false;
        for (let id of priorities) {
          const upg = game.upgrades.find(u => u.id === id);
          if (upg && game.currency >= upg.cost) {
            upg.purchase(game.tower, game);
            bought = true;
            break; // Restart priority list after a purchase
          }
        }
      } while (bought);

      loops++;
      
      if (loops % 50000 === 0) {
        console.log(`Simulating... Level: ${game.level}, Wave: ${game.currentWave}, Enemies: ${game.enemies.length}`);
      }
    }

    const endTime = performance.now();
    console.log(`%c[SIMULATOR] Finished in ${Math.round(endTime - startTime)}ms`, 'color: #0df; font-weight: bold;');
    console.log(`Reached Level: ${game.level}`);
    console.log(`Lives Remaining: ${game.lives}`);
    console.log(`Final Currency: ${game.currency}`);
    console.log(`Tower Stats: Dmg=${game.tower.damage.toFixed(1)}, CD=${game.tower.cooldown.toFixed(1)}, Rng=${game.tower.range.toFixed(1)}`);
    console.log(`Upgrades:`, game.upgrades.map(u => `${u.id}: Lvl ${u.level}`).join(', '));

    if (loops >= maxLoops) {
      console.warn("Simulation hit the maximum loop limit. The game might be stuck or progressing too slowly.");
    }

    // Restore audio and loop
    game.audioManager.playSound = originalPlaySound;
    game.audioManager.playExplosion = originalPlayExplosion;
    game.audioManager.playShoot = originalPlayShoot;
    game.isHeadless = false;
    game.lastTime = performance.now();
    game.loop(performance.now()); // Restart visual loop
  }
}
