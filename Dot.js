export class Dot {
  constructor({ canvas, ctx, stats, dots }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stats = stats;
    this.dots = dots;
    this.radius = 10;
    this.color = 'red';

    let position;
    do {
      position = this.getRandomPosition();
    } while (this.isColliding(position.x, position.y));

    this.x = position.x;
    this.y = position.y;
  }

  getRandomPosition() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
    };
  }

  isColliding(x, y) {
    for (let dot of this.dots) {
      const dx = dot.x - x;
      const dy = dot.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius * 2) {
        return true;
      }
    }
    return false;
  }

  static spawnDots(count, { canvas, ctx, stats, dots }) {
    for (let i = 0; i < count; i++) {
      if (stats.dotAmount < stats.maxDots) {
        const dot = new Dot({ canvas, ctx, stats, dots });
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
