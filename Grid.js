export class Grid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = {};
  }

  addDot(dot) {
    const cellX = Math.floor(dot.x / this.cellSize);
    const cellY = Math.floor(dot.y / this.cellSize);

    const cellKey = `${cellX},${cellY}`;
    if (!this.cells[cellKey]) {
      this.cells[cellKey] = [];
    }
    this.cells[cellKey].push(dot);
  }

  removeDot(dot) {
    const cellX = Math.floor(dot.x / this.cellSize);
    const cellY = Math.floor(dot.y / this.cellSize);

    const cellKey = `${cellX},${cellY}`;
    if (this.cells[cellKey]) {
      const index = this.cells[cellKey].indexOf(dot);
      if (index !== -1) {
        this.cells[cellKey].splice(index, 1);
      }
      if (this.cells[cellKey].length === 0) {
        delete this.cells[cellKey];
      }
    }
  }

  getNeighbors(cellX, cellY) {
    const neighbors = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cellKey = `${cellX + dx},${cellY + dy}`;
        if (this.cells[cellKey]) {
          neighbors.push(...this.cells[cellKey]);
        }
      }
    }
    return neighbors;
  }
}
