export class IconRenderer {
  static cache = new Map();

  static clearCache() {
    this.cache.clear();
  }

  static render(ctx, iconDef, x, y, w, h, color) {
    if (!iconDef) return;
    
    ctx.save();
    ctx.translate(x, y);
    
    if (iconDef.type === 'path') {
      const [vx, vy, vw, vh] = iconDef.viewBox;
      const scale = Math.min((w * 0.85) / vw, (h * 0.85) / vh);
      const offsetX = (w - vw * scale) / 2;
      const offsetY = (h - vh * scale) / 2;
      
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-vx, -vy);
      
      iconDef.paths.forEach(p => {
        const path = new Path2D(p);
        if (iconDef.fill) {
          ctx.fillStyle = color;
          ctx.fill(path);
        }
        if (iconDef.stroke) {
          ctx.strokeStyle = color;
          ctx.lineWidth = iconDef.lineWidth || 10;
          if (iconDef.lineJoin) ctx.lineJoin = iconDef.lineJoin;
          if (iconDef.lineCap) ctx.lineCap = iconDef.lineCap;
          ctx.stroke(path);
        }
      });
    } else if (iconDef.type === 'custom') {
      iconDef.draw(ctx, w, h, color);
    }
    
    ctx.restore();
  }

  static getCachedIcon(feature, w, h, color) {
    const dpr = window.devicePixelRatio || 1;
    const key = `${feature.id}-${w}-${h}-${color}-${dpr}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    IconRenderer.render(ctx, feature.iconDef, 0, 0, w, h, color);
    
    this.cache.set(key, canvas);
    return canvas;
  }

  static renderIcon(canvas, feature) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || parseInt(canvas.getAttribute('width'), 10) || 100;
    const h = rect.height || parseInt(canvas.getAttribute('height'), 10) || 100;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.strokeStyle = feature.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, w, h);
    
    const cachedCanvas = this.getCachedIcon(feature, w, h, feature.color);
    ctx.drawImage(cachedCanvas, 0, 0, w, h);
  }

  static drawIcon(ctx, feature, x, y, w, h, color) {
    const cachedCanvas = this.getCachedIcon(feature, w, h, color);
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(cachedCanvas, x, y, w, h);
    ctx.restore();
  }
}
