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
    this.joystickContainerRect
    this.joysticknubRect
    this.joystickOffset
  }

  setJoystickOffset() {
    this.joystickOffset = this.joystickContainerRect.width / 2 - this.joysticknubRect.width / 2
  }

  updateJoystickCenter() {
    this.joystickContainerRect = this.joystickContainer.getBoundingClientRect();
    this.joystickCenterX = this.joystickContainerRect.left + this.joystickContainerRect.width / 2;
    this.joystickCenterY = this.joystickContainerRect.top + this.joystickContainerRect.height / 2;
  }

  updateJoystick(player) {
    if (this.joystickActive) {
      player.x += this.dx * 0.1 * player.speed;
      player.y += this.dy * 0.1 * player.speed;
    }
  }

  centerNub() {
    this.joystick.style.transform = `translate(${this.dx + this.joystickOffset}px, ${this.dy + this.joystickOffset}px)`;
  }

  setupJoystickControls() {
    this.joystickContainer = document.createElement('joystick-container');
    document.body.appendChild(this.joystickContainer);

    this.joystick = document.createElement('joystick-nub');
    this.joystickContainer.appendChild(this.joystick);

    this.joystickContainerRect = this.joystickContainer.getBoundingClientRect();
    this.joysticknubRect = this.joystick.getBoundingClientRect();
    this.setJoystickOffset()
    this.centerNub()

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
        if (distance > this.joystickRadius) {
          const angle = Math.atan2(this.dy, this.dx);
          this.dx = this.joystickRadius * Math.cos(angle);
          this.dy = this.joystickRadius * Math.sin(angle);
        }
        this.centerNub()
      }
    });

    this.joystick.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.joystickActive = false;
      this.dx = 0;
      this.dy = 0;
      this.centerNub()
    });
  }
}
