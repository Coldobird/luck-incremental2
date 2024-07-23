export class Dot {
  constructor({ canvas, ctx, stats, dots, player, grid }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stats = stats;
    this.dots = dots;
    this.player = player;
    this.grid = grid;
    this.radius = 10;  // Radius of the dot
    this.color = 'red';

    let position;
    let attempts = 0;
    const maxAttempts = 100;  // Limit the number of attempts to find a position
    do {
      position = this.getRandomPosition();
      attempts++;
    } while (this.isColliding(position.x, position.y) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      // If no valid position is found after maxAttempts, do not create the dot
      this.x = undefined;
      this.y = undefined;
      return;
    }

    this.x = position.x;
    this.y = position.y;

    // Add dot to grid
    this.grid.addDot(this);
  }

  getRandomPosition() {
    const minX = this.radius;
    const maxX = this.canvas.width - this.radius;
    const minY = this.radius;
    const maxY = this.canvas.height - this.radius;

    return {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    };
  }

  isColliding(x, y) {
    const cellSize = this.grid.cellSize;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);

    const neighbors = this.grid.getNeighbors(cellX, cellY);

    for (let dot of neighbors) {
      const dx = dot.x - x;
      const dy = dot.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.radius * 2) {
        return true;
      }
    }

    // Check collision with the player
    const playerRadius = Math.max(this.stats.multiRange / 2, this.radius);
    const dx = this.player.x + playerRadius - x;
    const dy = this.player.y + playerRadius - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + playerRadius) {
      return true;
    }

    return false;
  }

  drawDot() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  static spawnDots(count, { canvas, ctx, stats, dots, player, grid }) {
    for (let i = 0; i < count; i++) {
      if (stats.dotAmount < stats.maxDots) {
        const dot = new Dot({ canvas, ctx, stats, dots, player, grid });
        if (dot.x !== undefined && dot.y !== undefined) {  // Only add valid dots
          dots.push(dot);
          stats.dotAmount += 1;
          stats.updateDotAmountDisplay();
        }
      }
    }
  }
}

customElements.define('dot-object', Dot);
