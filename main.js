import { updateJoystick } from './joystick-controlls.js';

const gameScreen = document.querySelector('#game-screen');
const player = document.createElement('player-element');
const counterDisplay = document.querySelector('#score-counter');
const dotCounterDisplay = document.querySelector('#dot-counter');
const keys = {};
let playerX = gameScreen.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameScreen.offsetHeight / 2 - player.offsetHeight / 2;

const gameState = {
  playerSpeed: 1,
  max: 10,
  spawnRate: 1,
};

const gameContainerInner = document.createElement('game-container-inner');
const playableArea = gameContainerInner;

const movePlayer = () => {
  const speedMultiplier = gameState.playerSpeed;

  updateJoystick();

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

let canPlaySound = true;

const playDotSound = () => {
  if (canPlaySound) {
    canPlaySound = false;
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
};

startInterval();

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

requestAnimationFrame(movePlayer);

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

updateDotCounter();
