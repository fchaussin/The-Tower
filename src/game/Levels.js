import { EnemyList } from './enemies/EnemyList.js';

// Configuration object to easily tweak the hardness progression
export const DIFFICULTY_CONFIG = {
  // Exponential Growth Multipliers
  swarmCountMultiplier: 1.05,
  spawnSpeedMultiplier: 0.98,
  
  // Linear Growth Multipliers (added per level)
  coreCountLinear: 0.8,
  eliteCountLinear: 0.2,
  
  // Loop Multiplier (extra difficulty per full 57-level loop)
  loopDifficultyMultiplier: 0.5, 
  
  // Base Enemy Counts (Level 1)
  baseSwarmCount: 12,
  baseCoreCount: 5,
  baseEliteCount: 2,
  
  // Base Spawn Intervals (ms)
  baseSwarmInterval: 500,
  baseCoreInterval: 1000,
  baseEliteInterval: 1500,
  
  // Minimum Spawn Intervals (ms) - Speed limits to prevent instant spawns
  minSwarmInterval: 40,
  minCoreInterval: 150,
  minEliteInterval: 300,
  
  // Currency and Timings
  baseBonusCurrency: 150,
  currencyPerLevel: 100,
  baseWaitTime: 2000,
  assaultWaitTime: 3000,
  bossWaitTime: 4000
};

class WaveBuilder {
  constructor() {
    this.events = [];
    this.currentTime = 0;
    this.currentWave = 0;
  }
  
  // Start a new wave
  nextWave() {
    this.currentWave++;
    return this;
  }
  
  // Add a sequence of the same enemy
  addSeries(EnemyClass, count, intervalMs, isBoss = false) {
    for (let i = 0; i < count; i++) {
      this.events.push({ time: this.currentTime, type: EnemyClass, isBoss, wave: this.currentWave });
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
        this.events.push({ time: t, type: seq.type, isBoss: seq.isBoss || false, wave: this.currentWave });
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

export const DIFFICULTY_LEVELS = {
  EASY: {
    id: 'EASY',
    name: 'Easy',
    enemyCountMult: 0.5,
    enemySpeedMult: 0.8,
    enemyHealthMult: 0.5,
    currencyBonusMult: 1.5,
    color: '#0f0'
  },
  MEDIUM: {
    id: 'MEDIUM',
    name: 'Medium',
    enemyCountMult: 0.8,
    enemySpeedMult: 1.0,
    enemyHealthMult: 0.8,
    currencyBonusMult: 1.2,
    color: '#ff0'
  },
  HARD: {
    id: 'HARD',
    name: 'Hard',
    enemyCountMult: 1.2,
    enemySpeedMult: 1.2,
    enemyHealthMult: 1.2,
    currencyBonusMult: 1.0,
    color: '#f00'
  }
};

export function getLevelConfig(level, difficultyId = 'MEDIUM') {
  const builder = new WaveBuilder();
  const cfg = DIFFICULTY_CONFIG;
  const diff = DIFFICULTY_LEVELS[difficultyId] || DIFFICULTY_LEVELS.MEDIUM;
  
  // 57 enemies total. We map each level to its corresponding enemy.
  // If level > 57, it loops back but with higher difficulty multipliers.
  const levelIndex = (level - 1) % EnemyList.length;
  const loop = Math.floor((level - 1) / EnemyList.length);
  
  // Exponential scaling for infinite difficulty
  const swarmDifficultyMult = Math.pow(cfg.swarmCountMultiplier, level - 1) * diff.enemyCountMult; 
  const speedDifficultyMult = Math.pow(cfg.spawnSpeedMultiplier, level - 1) / diff.enemySpeedMult; // Lower interval means faster
  
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
  
  const coreCount = Math.floor(vary((cfg.baseCoreCount + level * cfg.coreCountLinear) * (1 + loop * cfg.loopDifficultyMultiplier) * diff.enemyCountMult));
  const coreInterval = Math.max(cfg.minCoreInterval, vary(cfg.baseCoreInterval * speedDifficultyMult));
  
  const eliteCount = Math.floor(vary((cfg.baseEliteCount + level * cfg.eliteCountLinear) * (1 + loop * cfg.loopDifficultyMultiplier) * diff.enemyCountMult));
  const eliteInterval = Math.max(cfg.minEliteInterval, vary(cfg.baseEliteInterval * speedDifficultyMult));

  // --- WAVE 1: The Swarm ---
  // Tests raw attack speed and splash damage early in the level
  builder.nextWave()
         .addSeries(SwarmEnemy, swarmCount, swarmInterval)
         .wait(vary(cfg.baseWaitTime));
         
  // --- WAVE 2: The Core ---
  // Introduces the current tier's main enemy
  builder.nextWave()
         .addSeries(CoreEnemy, coreCount, coreInterval)
         .wait(vary(cfg.baseWaitTime));
         
  // --- WAVE 3: The Assault (Concurrent) ---
  // Mixes swarms with elites to protect the elites from single-target damage
  builder.nextWave()
         .addConcurrent([
    { type: SwarmEnemy, count: Math.floor(swarmCount * 1.5), intervalMs: swarmInterval * 0.8 },
    { type: EliteEnemy, count: eliteCount, intervalMs: eliteInterval },
    { type: CoreEnemy, count: coreCount, intervalMs: coreInterval }
  ]).wait(vary(cfg.assaultWaitTime));
  
  // --- WAVE 4: Boss (Every 5 levels) ---
  if (level % 5 === 0) {
    builder.nextWave();
    // Pick a boss from slightly ahead in the list (or loop back if at the end)
    const bossIndex = Math.min(EnemyList.length - 1, levelIndex + 5);
    const BossEnemy = EnemyList[bossIndex];
    const bossCount = Math.max(1, Math.floor(vary((level / 5) * (1 + loop))));
    
    // Boss arrives with a massive escort
    builder.addConcurrent([
      { type: BossEnemy, count: bossCount, intervalMs: vary(cfg.baseWaitTime), isBoss: true },
      { type: SwarmEnemy, count: swarmCount * 2, intervalMs: swarmInterval * 0.5 },
      { type: CoreEnemy, count: coreCount, intervalMs: coreInterval }
    ]).wait(vary(cfg.bossWaitTime));
  }
  
  return {
    events: builder.build(),
    totalWaves: builder.currentWave,
    bonusCurrency: Math.floor((cfg.baseBonusCurrency + (level - 1) * cfg.currencyPerLevel) * diff.currencyBonusMult)
  };
}
