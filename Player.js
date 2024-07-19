export class Player {
  constructor({ canvas, ctx, dots, joystick, stats }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dots = dots;
    this.joystick = joystick;
    this.stats = stats;

    this.maxSounds = 8; // Maximum number of sounds that can play at once
    this.currentSounds = 0; // Current number of playing sounds
    this.audioPool = []; // Pool of audio elements
    this.poolSize = 10; // Size of the audio pool
    this.initAudioPool('midia/pop.mp3');

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

  initAudioPool(src) {
    for (let i = 0; i < this.poolSize; i++) {
      const audio = new Audio(src);
      audio.addEventListener('ended', () => {
        this.currentSounds--;
      });
      this.audioPool.push(audio);
    }
  }

  getAudio() {
    for (const audio of this.audioPool) {
      if (audio.paused) {
        return audio;
      }
    }
    return null;
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
      if (this.currentSounds < this.maxSounds) {
        this.playSound();
      }
      this.stats.money += collisions * this.stats.multiMoney;
      this.stats.updateMoneyDisplay();
    }
  }

  playSound() {
    const popSound = this.getAudio();
    if (popSound) {
      this.currentSounds++;
      popSound.currentTime = 0; // Reset the audio to start from the beginning
      popSound.play();
    }
  }
  
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.stats.multiRange, this.stats.multiRange);
  }
}

customElements.define('player-character', Player);
