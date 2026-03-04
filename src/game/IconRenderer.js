import { DamageFeature } from './features/DamageFeature.js';
import { RangeFeature } from './features/RangeFeature.js';
import { CooldownFeature } from './features/CooldownFeature.js';
import { SpeedFeature } from './features/SpeedFeature.js';
import { SplashFeature } from './features/SplashFeature.js';
import { ChainFeature } from './features/ChainFeature.js';
import { PoisonFeature } from './features/PoisonFeature.js';
import { SlowFeature } from './features/SlowFeature.js';

export class IconRenderer {
  static renderIcon(canvas, feature) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = feature.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    feature.draw(ctx, 0, 0, canvas.width, canvas.height, feature.color);
  }

  static renderTowerFeatureIcons() {
    const features = [
      { id: 'icon-damage', feature: new DamageFeature() },
      { id: 'icon-poison', feature: new PoisonFeature() },
      { id: 'icon-speed', feature: new SpeedFeature() },
      { id: 'icon-range', feature: new RangeFeature() },
      { id: 'icon-chain', feature: new ChainFeature() },
      { id: 'icon-splash', feature: new SplashFeature() },
      { id: 'icon-cooldown', feature: new CooldownFeature() },
      { id: 'icon-slow', feature: new SlowFeature() }
    ];

    features.forEach(({ id, feature }) => {
      const canvas = document.getElementById(id);
      if (canvas) {
        this.renderIcon(canvas, feature);
      }
    });
  }
}
