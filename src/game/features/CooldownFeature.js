import { TowerFeature } from './TowerFeature.js';

export class CooldownFeature extends TowerFeature {
  constructor() {
    super({
      id: 'cooldown',
      baseCost: 15,
      costMultiplier: 1.15,
      baseIntensity: 0.95,
      intensityMultiplier: 1,
      intensityAddition: 0,
      color: '#fff',
      iconDef: {
        type: 'path',
        viewBox: [4.5, 1.5, 15, 21],
        paths: ["M8.827 6.956c2.265.662 5.109-.295 8.172-1.867l.001.079c0 1.3-1.642 2.897-3.248 4.288a3.818 3.818 0 0 0-.752.898v6.726c1.321.372 2.815 2.089 3.827 3.655-.027.088-.043.179-.077.265h-8.5c-.034-.087-.057-.17-.082-.254 1.01-1.57 2.509-3.293 3.833-3.666v-6.729a3.819 3.819 0 0 0-.73-.88 17.898 17.898 0 0 1-2.443-2.515zM17.922 2H20v1h-1.516A5.594 5.594 0 0 1 19 5.319c0 2.15-1.479 4.294-3.545 6.092a1.544 1.544 0 0 0-.62 1.089 1.544 1.544 0 0 0 .62 1.089C17.521 15.387 19 17.53 19 19.68a5.595 5.595 0 0 1-.516 2.32H20v1H5v-1h1.5A5.666 5.666 0 0 1 6 19.68c0-2.15 1.479-4.294 3.545-6.092a1.544 1.544 0 0 0 .62-1.089 1.544 1.544 0 0 0-.62-1.089C7.479 9.613 6 7.47 6 5.32A5.666 5.666 0 0 1 6.5 3H5V2zm-.544 1H7.624A4.68 4.68 0 0 0 7 5.32c0 1.645 1.137 3.54 3.2 5.336a2.435 2.435 0 0 1 .966 1.844 2.432 2.432 0 0 1-.965 1.843C8.137 16.14 7 18.035 7 19.681A4.68 4.68 0 0 0 7.623 22h9.753A4.646 4.646 0 0 0 18 19.68c0-1.645-1.137-3.54-3.2-5.336a2.435 2.435 0 0 1-.966-1.844 2.432 2.432 0 0 1 .965-1.843C16.863 8.86 18 6.965 18 5.319A4.646 4.646 0 0 0 17.378 3z"],
        fill: true
      }
    });
  }

  apply(tower, intensity) {
    // Ensure intensity stays below 1.0 to prevent cooldown from increasing
    // We cap it at 0.99 to ensure it's always at least a tiny upgrade
    const safeIntensity = Math.min(0.99, intensity);
    tower.cooldown = Math.max(20, tower.cooldown * safeIntensity);
  }
}
