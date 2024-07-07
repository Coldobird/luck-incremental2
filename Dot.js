export class Dot {
  constructor({ canvas, ctx, stats }) {
    this.canvas = canvas
    this.ctx = ctx
    this.stats = stats

    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.radius = 10
    this.color = 'red'
  }

  drawDot() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  };

  spawnDot() {
    if (this.stats.dotAmout < this.stats.maxDots) {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.stats.dotAmout += 1;
      this.stats.updateDotAmountDisplay();
    }
  };
}

customElements.define('dot-object', Dot);
