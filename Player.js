export class Player {
  constructor({ canvas, ctx, dots, joystick, stats }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dots = dots;
    this.joystick = joystick;
    this.stats = stats;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.color = 'blue';
    this.speed = 2;

    this.keys = {};
    this.upKeys = ['ArrowUp', 'w'];
    this.downKeys = ['ArrowDown', 's'];
    this.leftKeys = ['ArrowLeft', 'a'];
    this.rightKeys = ['ArrowRight', 'd'];

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  update() {
    if (this.upKeys.some(key => this.keys[key])) this.y -= this.speed;
    if (this.downKeys.some(key => this.keys[key])) this.y += this.speed;
    if (this.leftKeys.some(key => this.keys[key])) this.x -= this.speed;
    if (this.rightKeys.some(key => this.keys[key])) this.x += this.speed;

    this.joystick.updateJoystick(this);

    // Prevent player from moving out of bounds
    this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
  }

  checkCollision() {
    let collisions = 0;

    for (let i = this.dots.length - 1; i >= 0; i--) {
      const dot = this.dots[i];
      const distX = this.x + this.width / 2 - dot.x;
      const distY = this.y + this.height / 2 - dot.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
    
      if (distance < this.width / 2 + dot.radius) {
        collisions++;
        this.stats.dotAmount--;
        this.stats.updateDotAmountDisplay();
        this.dots.splice(i, 1);
      }
    }

    if (collisions > 0) {
      console.log(this.stats.getMultiMoney());
      this.stats.money += collisions * this.stats.getMultiMoney();
      this.stats.updateMoneyDisplay(collisions);
    }
  }
  
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

customElements.define('player-character', Player);
