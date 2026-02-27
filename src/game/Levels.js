import { EnemyList } from './enemies/EnemyList.js';

// Configuration object to easily tweak the hardness progression
export const DIFFICULTY_CONFIG = {
  // Exponential Growth Multipliers
  swarmCountMultiplier: 1.08,    // Exponential growth for swarm numbers (was 1.15)
  spawnSpeedMultiplier: 0.95,    // Exponential decrease for spawn intervals (was 0.9/0.95)
  
  // Linear Growth Multipliers (added per level)
  coreCountLinear: 1.2,          // Linear growth for core enemies per level (was 1.5)
  eliteCountLinear: 0.4,         // Linear growth for elite enemies per level (was 0.5)
  
  // Loop Multiplier (extra difficulty per full 57-level loop)
  loopDifficultyMultiplier: 0.5, 
  
  // Base Enemy Counts (Level 1)
  baseSwarmCount: 12,            // Was 15
  baseCoreCount: 5,              // Was 5
  baseEliteCount: 2,             // Was 2
  
  // Base Spawn Intervals (ms)
  baseSwarmInterval: 500,        // Was 400
  baseCoreInterval: 1000,        // Was 800
  baseEliteInterval: 1500,       // Was 1000
  
  // Minimum Spawn Intervals (ms) - Speed limits to prevent instant spawns
  minSwarmInterval: 40,          // Was 20
  minCoreInterval: 150,          // Was 100
  minEliteInterval: 300,         // Was 200
  
  // Currency and Timings
  baseBonusCurrency: 50,
  currencyPerLevel: 20,
  baseWaitTime: 2000,
  assaultWaitTime: 3000,
  bossWaitTime: 4000
};

class WaveBuilder {
  constructor() {
    this.events = [];
    this.currentTime = 0;
  }
  
  // Add a sequence of the same enemy
  addSeries(EnemyClass, count, intervalMs) {
    for (let i = 0; i < count; i++) {
      this.events.push({ time: this.currentTime, type: EnemyClass });
      this.currentTime += intervalMs;
    }
    return this;
  }
  
  // Add multiple sequences that spawn concurrently
  addConcurrent(sequences) {
    let start = this.currentTime;
    let maxTime = start;
    for (let seq of sequences) {
      let t = start;
      for (let i = 0; i < seq.count; i++) {
        this.events.push({ time: t, type: seq.type });
        t += seq.intervalMs;
      }
      if (t > maxTime) maxTime = t;
    }
    this.currentTime = maxTime;
    return this;
  }
  
  // Wait before the next wave
  wait(ms) {
    this.currentTime += ms;
    return this;
  }
  
  build() {
    // Sort events by time to ensure sequential processing
    this.events.sort((a, b) => a.time - b.time);
    return this.events;
  }
}

export function getLevelConfig(level) {
  const builder = new WaveBuilder();
  const cfg = DIFFICULTY_CONFIG;
  
  // 57 enemies total. We map each level to its corresponding enemy.
  // If level > 57, it loops back but with higher difficulty multipliers.
  const levelIndex = (level - 1) % EnemyList.length;
  const loop = Math.floor((level - 1) / EnemyList.length);
  
  // Exponential scaling for infinite difficulty
  const swarmDifficultyMult = Math.pow(cfg.swarmCountMultiplier, level - 1); 
  const speedDifficultyMult = Math.pow(cfg.spawnSpeedMultiplier, level - 1);
  
  // Controlled randomness: +/- 20% variance around a base value
  const vary = (val) => val * (0.8 + Math.random() * 0.4);
  
  // Helper to pick a random enemy from a specific range of unlocked enemies
  const getRandomEnemy = (maxIndex) => {
    const index = Math.floor(Math.random() * (maxIndex + 1));
    return EnemyList[Math.min(index, EnemyList.length - 1)];
  };

  // 1. Core Enemy: The star of this level (progresses exactly from 1 to 57)
  const CoreEnemy = EnemyList[levelIndex];
  
  // 2. Swarm Enemy: A randomly chosen weaker enemy (from the bottom 30% of unlocked enemies)
  const maxSwarmIndex = Math.max(0, Math.floor(levelIndex * 0.3));
  const SwarmEnemy = getRandomEnemy(maxSwarmIndex);
  
  // 3. Elite/Support Enemy: A randomly chosen enemy from anywhere in the unlocked pool
  const maxEliteIndex = Math.max(0, levelIndex - 1);
  const EliteEnemy = getRandomEnemy(maxEliteIndex);

  // --- Deterministic Base Values with Probabilistic Variance ---
  const swarmCount = Math.floor(vary(cfg.baseSwarmCount * swarmDifficultyMult));
  const swarmInterval = Math.max(cfg.minSwarmInterval, vary(cfg.baseSwarmInterval * speedDifficultyMult));
  
  const coreCount = Math.floor(vary((cfg.baseCoreCount + level * cfg.coreCountLinear) * (1 + loop * cfg.loopDifficultyMultiplier)));
  const coreInterval = Math.max(cfg.minCoreInterval, vary(cfg.baseCoreInterval * speedDifficultyMult));
  
  const eliteCount = Math.floor(vary((cfg.baseEliteCount + level * cfg.eliteCountLinear) * (1 + loop * cfg.loopDifficultyMultiplier)));
  const eliteInterval = Math.max(cfg.minEliteInterval, vary(cfg.baseEliteInterval * speedDifficultyMult));

  // --- WAVE 1: The Swarm ---
  // Tests raw attack speed and splash damage early in the level
  builder.addSeries(SwarmEnemy, swarmCount, swarmInterval)
         .wait(vary(cfg.baseWaitTime));
         
  // --- WAVE 2: The Core ---
  // Introduces the current tier's main enemy
  builder.addSeries(CoreEnemy, coreCount, coreInterval)
         .wait(vary(cfg.baseWaitTime));
         
  // --- WAVE 3: The Assault (Concurrent) ---
  // Mixes swarms with elites to protect the elites from single-target damage
  builder.addConcurrent([
    { type: SwarmEnemy, count: Math.floor(swarmCount * 1.5), intervalMs: swarmInterval * 0.8 },
    { type: EliteEnemy, count: eliteCount, intervalMs: eliteInterval },
    { type: CoreEnemy, count: coreCount, intervalMs: coreInterval }
  ]).wait(vary(cfg.assaultWaitTime));
  
  // --- WAVE 4: Boss (Every 5 levels) ---
  if (level % 5 === 0) {
    // Pick a boss from slightly ahead in the list (or loop back if at the end)
    const bossIndex = Math.min(EnemyList.length - 1, levelIndex + 5);
    const BossEnemy = EnemyList[bossIndex];
    const bossCount = Math.max(1, Math.floor(vary((level / 5) * (1 + loop))));
    
    // Boss arrives with a massive escort
    builder.addConcurrent([
      { type: BossEnemy, count: bossCount, intervalMs: vary(cfg.baseWaitTime) },
      { type: SwarmEnemy, count: swarmCount * 2, intervalMs: swarmInterval * 0.5 },
      { type: CoreEnemy, count: coreCount, intervalMs: coreInterval }
    ]).wait(vary(cfg.bossWaitTime));
  }
  
  return {
    events: builder.build(),
    bonusCurrency: Math.floor(vary(cfg.baseBonusCurrency + (level - 1) * cfg.currencyPerLevel))
  };
}
