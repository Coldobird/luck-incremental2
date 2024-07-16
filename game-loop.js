import { Dot } from "./Dot.js";
import { Joystick } from "./joystick-controlls.js";
import { Player } from "./player.js";
import stats from "./Stats.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const joystick = new Joystick({});
const dots = [];
const player = new Player({ canvas, ctx, dots, joystick, stats });

const isMobile = window.matchMedia("(pointer:none), (pointer:coarse)").matches;

let lastDotSpawnTime = 0;

const spawnDot = (count) => {
  for (let i = 0; i < count; i++) {
    if (stats.dotAmount < stats.maxDots) {
      const dot = new Dot({ canvas, ctx, stats });
      dots.push(dot);
      stats.dotAmount += 1;
      stats.updateDotAmountDisplay();
    }
  }
};

//////////////////////////////////////////////////////////////////////////////
// On Load
//
if (isMobile) joystick.setupJoystickControls();
stats.setupStats();

//////////////////////////////////////////////////////////////////////////////
// Main Game Loop
//
const gameLoop = (timestamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.checkCollision();
  player.draw();
  dots.forEach(dot => dot.drawDot());

  if (timestamp - lastDotSpawnTime > stats.multiSpawnRate) {
    spawnDot(1);
    lastDotSpawnTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
};

gameLoop();
