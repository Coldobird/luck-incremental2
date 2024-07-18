export class Player {
  constructor({ canvas, ctx, dots, joystick, stats }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dots = dots;
    this.joystick = joystick;
    this.stats = stats;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.color = 'blue';

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
    if (this.upKeys.some(key => this.keys[key])) this.y -= this.stats.multiSpeed;
    if (this.downKeys.some(key => this.keys[key])) this.y += this.stats.multiSpeed;
    if (this.leftKeys.some(key => this.keys[key])) this.x -= this.stats.multiSpeed;
    if (this.rightKeys.some(key => this.keys[key])) this.x += this.stats.multiSpeed;

    this.joystick.updateJoystick(this);

    // Prevent player from moving out of bounds
    this.x = Math.max(0, Math.min(this.canvas.width - this.stats.multiRange, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height - this.stats.multiRange, this.y));
  }

  checkCollision() {
    let collisions = 0;
    const popSound = new Audio('midia/pop.mp3');

    for (let i = this.dots.length - 1; i >= 0; i--) {
      const dot = this.dots[i];
      const distX = this.x + this.stats.multiRange / 2 - dot.x;
      const distY = this.y + this.stats.multiRange / 2 - dot.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
    
      if (distance < this.stats.multiRange / 2 + dot.radius) {
        collisions++;
        this.stats.dotAmount--;
        this.stats.updateDotAmountDisplay();
        this.dots.splice(i, 1);
      }
    }

    if (collisions > 0) {
      popSound.play();
      this.stats.money += collisions * this.stats.multiMoney;
      this.stats.updateMoneyDisplay();
    }
  }
  
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.stats.multiRange, this.stats.multiRange);
  }
}

customElements.define('player-character', Player);
