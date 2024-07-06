export class Joystick {
  constructor() {
    this.joystick = null;
    this.joystickContainer = null;
    this.joystickCenterX = 0;
    this.joystickCenterY = 0;
    this.joystickActive = false;
    this.dx = 0;
    this.dy = 0;
    this.joystickRadius = 0;
  }

  updateJoystickCenter() {
    const joystickContainerRect = this.joystickContainer.getBoundingClientRect();
    this.joystickCenterX = joystickContainerRect.left + joystickContainerRect.width / 2;
    this.joystickCenterY = joystickContainerRect.top + joystickContainerRect.height / 2;
  }

  updateJoystick(player) {
    if (this.joystickActive) {
      player.x += this.dx * 0.1 * player.speed;
      player.y += this.dy * 0.1 * player.speed;
    }
  }

  setupJoystickControls() {
    this.joystickContainer = document.createElement('joystick-container');
    document.body.appendChild(this.joystickContainer);

    this.joystick = document.createElement('joystick-nub');
    this.joystickContainer.appendChild(this.joystick);

    this.joystickRadius = this.joystickContainer.offsetWidth / 2 - this.joystick.offsetWidth / 2;

    this.joystick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.joystickActive = true;
      this.updateJoystickCenter();
    });

    this.joystick.addEventListener('touchmove', (e) => {
      if (this.joystickActive) {
        e.preventDefault();
        const touch = e.touches[0];
        this.dx = touch.clientX - this.joystickCenterX;
        this.dy = touch.clientY - this.joystickCenterY;
        
        const distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        
        console.log(this.joystickCenterX);
        if (distance > this.joystickRadius) {
          const angle = Math.atan2(this.dy, this.dx);
          this.dx = this.joystickRadius * Math.cos(angle);
          this.dy = this.joystickRadius * Math.sin(angle);
        }

        this.joystick.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
      }
    });

    this.joystick.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.joystickActive = false;
      this.dx = 0;
      this.dy = 0;
      this.joystick.style.transform = 'translate(30px, 30px)';
    });
  }
}
