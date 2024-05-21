const gameScreen = document.querySelector('game-screen');
const player = document.querySelector('player-element');
const joystick = document.querySelector('joystick');
const joystickContainer = document.querySelector('joystick-container');
const counterDisplay = document.querySelector('score-counter');
const dotCounterDisplay = document.querySelector('dot-counter');
const keys = {};
let playerX = gameScreen.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameScreen.offsetHeight / 2 - player.offsetHeight / 2;
let joystickCenterX = 0;
let joystickCenterY = 0;
let joystickActive = false;
let dx = 0;
let dy = 0;
const joystickRadius = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;
let counter = 0;

const updateJoystickCenter = () => {
  const joystickContainerRect = joystickContainer.getBoundingClientRect();
  joystickCenterX = joystickContainerRect.left + joystickContainerRect.width / 2;
  joystickCenterY = joystickContainerRect.top + joystickContainerRect.height / 2;
};

const gameContainerInner = document.querySelector('game-container-inner');
const playableArea = gameContainerInner;

const movePlayer = () => {
  const speedMultiplier = gameState.playerSpeed;

  if (joystickActive) {
    playerX += dx * 0.1 * speedMultiplier;
    playerY += dy * 0.1 * speedMultiplier;
  }

  if (keys['w'] || keys['arrowup']) {
    playerY -= 2 * speedMultiplier;
  }
  if (keys['s'] || keys['arrowdown']) {
    playerY += 2 * speedMultiplier;
  }
  if (keys['a'] || keys['arrowleft']) {
    playerX -= 2 * speedMultiplier;
  }
  if (keys['d'] || keys['arrowright']) {
    playerX += 2 * speedMultiplier;
  }

  const playerRadius = player.clientWidth / 2;
  playerX = Math.max(playerRadius, Math.min(playerX, playableArea.clientWidth - playerRadius));
  playerY = Math.max(playerRadius, Math.min(playerY, playableArea.clientHeight - playerRadius));
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  checkDotCollision();

  requestAnimationFrame(movePlayer);
};

const createDot = () => {
  const currentDots = document.querySelectorAll('.dot').length;
  if (currentDots < gameState.max) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    playableArea.appendChild(dot);

    const spawnableWidth = playableArea.clientWidth - dot.clientWidth;
    const spawnableHeight = playableArea.clientHeight - dot.clientHeight;
    const dotRadius = dot.clientWidth / 2;
    dot.style.left = `${Math.random() * spawnableWidth}px`;
    dot.style.top = `${Math.random() * spawnableHeight}px`;
    updateDotCounter();
  }
};

const checkDotCollision = () => {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    const dotRect = dot.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.left < dotRect.left + dotRect.width &&
      playerRect.left + playerRect.width > dotRect.left &&
      playerRect.top < dotRect.top + dotRect.height &&
      playerRect.top + playerRect.height > dotRect.top
    ) {
      dot.remove();
      counter++;
      counterDisplay.textContent = `Score: ${counter}`;
      updateDotCounter();
      playDotSound();
    }
  });
};

const updateDotCounter = () => {
  const currentDots = document.querySelectorAll('.dot').length;
  dotCounterDisplay.textContent = `Dots: ${currentDots}/${gameState.max}`;
};

let canPlaySound = true

const playDotSound = () => {
  if (canPlaySound) {
    console.log('entrou');
    canPlaySound = false
    const dotSound = new Audio('/midia/pop.mp3');
    dotSound.play();
    setTimeout(() => canPlaySound = true, 10);
  }
};

let dotCreatingInterval;

const startInterval = () => {
  clearInterval(dotCreatingInterval);
  const spawnDelay = 1000 / gameState.spawnRate;
  dotCreatingInterval = setInterval(createDot, spawnDelay);
}

startInterval(createDot, 1000 / gameState.spawnRate);

joystick.addEventListener('touchstart', (e) => {
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

const upgradeScreen = document.querySelector('upgrade-screen');
const goToUpgrades = () => {
  gameScreen.classList.add('hidden');
  upgradeScreen.classList.remove('hidden');
  upgradeTree.displayUpgradeTree(container);
};

const goToMain = () => {
  upgradeTree.removeUpgradeTree();
  upgradeScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
};

// Keyboard Event Handlers
const handleKeyDown = (e) => {
  keys[e.key.toLowerCase()] = true;
};

const handleKeyUp = (e) => {
  keys[e.key.toLowerCase()] = false;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

requestAnimationFrame(movePlayer);

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

updateDotCounter();
