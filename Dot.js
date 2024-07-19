export class Dot {
  constructor({ canvas, ctx, stats }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stats = stats;

    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.radius = 10;
    this.color = 'red';
  }

  static spawnDots(count, { canvas, ctx, stats, dots }) {
    for (let i = 0; i < count; i++) {
      if (stats.dotAmount < stats.maxDots) {
        const dot = new Dot({ canvas, ctx, stats });
        dots.push(dot);
        stats.dotAmount += 1;
        stats.updateDotAmountDisplay();
      }
    }
  }

  drawDot() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

customElements.define('dot-object', Dot);
