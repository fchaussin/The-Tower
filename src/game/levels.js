import { BasicEnemy } from './enemies/BasicEnemy.js';
import { FastEnemy } from './enemies/FastEnemy.js';
import { TankEnemy } from './enemies/TankEnemy.js';
import { SplitterEnemy } from './enemies/SplitterEnemy.js';
import { RageEnemy } from './enemies/RageEnemy.js';
import { SwarmEnemy } from './enemies/SwarmEnemy.js';
import { BossEnemy } from './enemies/BossEnemy.js';

export function getLevelConfig(level) {
  // Predefined levels for specific scenarios
  const predefined = {
    1: {
      enemies: [
        { type: BasicEnemy, count: 10 },
        { type: SwarmEnemy, count: 5 }
      ],
      spawnInterval: 1800,
      bonusCurrency: 0
    },
    2: {
      enemies: [
        { type: BasicEnemy, count: 12 },
        { type: SwarmEnemy, count: 8 },
        { type: FastEnemy, count: 3 }
      ],
      spawnInterval: 1500,
      bonusCurrency: 5
    },
    3: {
      enemies: [
        { type: BasicEnemy, count: 15 },
        { type: FastEnemy, count: 6 },
        { type: TankEnemy, count: 2 },
        { type: SwarmEnemy, count: 10 }
      ],
      spawnInterval: 1200,
      bonusCurrency: 10
    },
    4: {
      enemies: [
        { type: BasicEnemy, count: 15 },
        { type: FastEnemy, count: 8 },
        { type: TankEnemy, count: 4 },
        { type: SplitterEnemy, count: 3 },
        { type: RageEnemy, count: 1 }
      ],
      spawnInterval: 1000,
      bonusCurrency: 15
    },
    5: {
      enemies: [
        { type: BossEnemy, count: 1 },
        { type: SwarmEnemy, count: 25 },
        { type: RageEnemy, count: 3 }
      ],
      spawnInterval: 800,
      bonusCurrency: 25
    }
  };

  if (predefined[level]) {
    return predefined[level];
  }

  // Procedural generation for infinite scaling beyond predefined levels
  let isBossLevel = level % 5 === 0;
  
  return {
    enemies: [
      { type: BasicEnemy, count: 15 + Math.floor(level * 2) },
      { type: SwarmEnemy, count: 10 + Math.floor(level * 3) },
      { type: FastEnemy, count: 5 + Math.floor(level * 1.5) },
      { type: TankEnemy, count: 3 + Math.floor(level / 2) },
      { type: SplitterEnemy, count: 2 + Math.floor(level / 2) },
      { type: RageEnemy, count: 1 + Math.floor(level / 3) },
      { type: BossEnemy, count: isBossLevel ? Math.floor(level / 5) : 0 }
    ],
    spawnInterval: Math.max(300, 1000 - (level - 5) * 60),
    bonusCurrency: 20 + (level - 5) * 5
  };
}
