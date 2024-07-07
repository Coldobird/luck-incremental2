import { Dot } from "./Dot.js";
import { Joystick } from "./joystick-controlls.js";
import { Player } from "./player.js";
import { Stats } from "./Stats.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const stats = new Stats({});
const joystick = new Joystick({});
const dots = [];
const player = new Player({ canvas, ctx, dots, joystick, stats });

const isMobile = window.matchMedia("(pointer:none), (pointer:coarse)").matches;

//////////////////////////////////////////////////////////////////////////////
// On Load
//
if (isMobile) joystick.setupJoystickControls();
stats.setupStats();

const spawnDot = (numDots = 1) => {
  for (let i = 0; i < numDots; i++) {
    if (stats.dotAmout < stats.maxDots) {
      const dot = new Dot({ canvas, ctx, stats });
      dots.push(dot);
      stats.dotAmout += 1;
      stats.updateDotAmountDisplay();
    }
  }
};

setInterval(() => spawnDot(1), 1000);

//////////////////////////////////////////////////////////////////////////////
// Main Game Loop
//
const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.checkCollision();
  player.draw();
  dots.forEach(dot => dot.drawDot());
  requestAnimationFrame(gameLoop);
};

gameLoop();
