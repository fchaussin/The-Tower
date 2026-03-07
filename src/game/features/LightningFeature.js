import { TowerFeature } from './TowerFeature.js';

export class LightningFeature extends TowerFeature {
  constructor() {
    super({
      id: 'lightning',
      baseCost: 200,
      costMultiplier: 1.6,
      baseIntensity: 1,
      intensityMultiplier: 1,
      intensityAddition: 0,
      color: '#0ff',
      iconDef: {
        type: 'path',
        viewBox: [0, 0, 17, 24],
        paths: ["m0 13.714h7.875l-2.738 10.286 12.006-13.714h-7.875l2.732-10.286z"],
        fill: true
      }
    });
  }

  apply(tower, intensity) {
    tower.lightningCount = (tower.lightningCount || 0) + Math.floor(intensity);
    tower.lightningRange = (tower.lightningRange || 0) + 20;
  }
}
