export class Player {
  constructor({ canvas, ctx, dot, joystick }) {
    this.canvas = canvas
    this.ctx = ctx
    this.dot = dot
    this.joystick = joystick

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.color = 'blue';
    this.speed = 5;

    this.keys = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  update() {
    if (this.keys['ArrowUp']) this.y -= this.speed;
    if (this.keys['ArrowDown']) this.y += this.speed;
    if (this.keys['ArrowLeft']) this.x -= this.speed;
    if (this.keys['ArrowRight']) this.x += this.speed;

    this.joystick.updateJoystick(this)

    // Prevent player from moving out of bounds
    this.x = Math.max(0, Math.min(this.canvas.width - this.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height - this.height, this.y));
  };

  checkCollision() {
    const distX = this.x + this.width / 2 - this.dot.x;
    const distY = this.y + this.height / 2 - this.dot.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.width / 2 + this.dot.radius) {
      this.dot.x = Math.random() * this.canvas.width;
      this.dot.y = Math.random() * this.canvas.height;
    }
  };

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

customElements.define('player-character', Player);
