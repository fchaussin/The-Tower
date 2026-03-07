import { TowerFeature } from './TowerFeature.js';

export class SlowFeature extends TowerFeature {
  constructor() {
    super({
      id: 'slow',
      baseCost: 150,
      costMultiplier: 1.3,
      baseIntensity: 0.05,
      intensityMultiplier: 1,
      intensityAddition: 0,
      color: '#4af',
      iconDef: {
        type: 'path',
        viewBox: [0, 0, 24, 24],
        paths: ["M2 12L22 12M12 2L12 22M20 16L16 12L20 8M4 8L8 12L4 16M16 4L12 8L8 4M8 20L12 16L16 20"],
        stroke: true,
        lineWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
      }
    });
  }

  apply(tower, intensity) {
    // Slow intensity is the percentage of speed reduction
    // We cap it at 80% to avoid stopping enemies completely
    tower.slowIntensity = Math.min(0.8, (tower.slowIntensity || 0) + intensity);
    tower.slowDuration = (tower.slowDuration || 0) + 1.0; // +1 second duration per level
  }
}
