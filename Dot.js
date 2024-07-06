export class Dot {
  constructor({ canvas, ctx }) {
    this.canvas = canvas
    this.ctx = ctx

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
}

customElements.define('dot-object', Dot);
