let joystick, joystickContainer;
let joystickCenterX = 0;
let joystickCenterY = 0;
let joystickActive = false;
let dx = 0;
let dy = 0;
let joystickRadius;

const updateJoystickCenter = () => {
  const joystickContainerRect = joystickContainer.getBoundingClientRect();
  joystickCenterX = joystickContainerRect.left + joystickContainerRect.width;
  joystickCenterY = joystickContainerRect.top + joystickContainerRect.height;
};

export const updateJoystick = () => {
  if (joystickActive) {
    player.x += dx * 0.1 * player.speed;
    player.y += dy * 0.1 * player.speed;
  }
};

export const setupJoystickControls = () => {
  joystickContainer = document.createElement('div');
  joystickContainer.id = 'joystick-container';
  document.body.appendChild(joystickContainer);

  joystick = document.createElement('div');
  joystick.id = 'joystick';
  joystickContainer.appendChild(joystick);

  joystickRadius = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;

  joystick.addEventListener('touchstart', (e) => {
    console.log('oioioi');
    e.preventDefault();
    joystickActive = true;
    updateJoystickCenter();
  });

  joystick.addEventListener('touchmove', (e) => {
    if (joystickActive) {
      e.preventDefault();
      const touch = e.touches[0];
      dx = touch.clientX - joystickCenterX;
      dy = touch.clientY - joystickCenterY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > joystickRadius) {
        const angle = Math.atan2(dy, dx);
        dx = joystickRadius * Math.cos(angle);
        dy = joystickRadius * Math.sin(angle);
      }

      joystick.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  });

  joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    joystickActive = false;
    dx = 0;
    dy = 0;
    joystick.style.transform = 'translate(0, 0)';
  });
};
