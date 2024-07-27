export class BackgroundManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.stones = [];
    this.backgroundImage = new Image();
    this.backgroundImage.src = '/midia/img/dirt.png';
    this.stoneImages = [
      '/midia/img/rocks1.png',
      '/midia/img/rocks2.png',
      '/midia/img/rocks3.png'
    ];
  }

  setup() {
    this.generateStones();
  }

  generateStones() {
    const numStones = 70;
    for (let i = 0; i < numStones; i++) {
      const stone = {
        image: new Image(),
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        rotation: Math.random() * 360,
        size: 100 + Math.random() * 100
      };
      stone.image.src = this.stoneImages[Math.floor(Math.random() * this.stoneImages.length)];
      this.stones.push(stone);
    }
  }

  draw() {
    const pattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stones.forEach(stone => {
      this.ctx.save();
      this.ctx.translate(stone.x, stone.y);
      this.ctx.rotate(stone.rotation * Math.PI / 180);
      this.ctx.drawImage(stone.image, -stone.size/2, -stone.size/2, stone.size, stone.size);
      this.ctx.restore();
    });
  }
}