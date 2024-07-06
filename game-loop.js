import { Dot } from "./Dot.js";
import { Joystick } from "./joystick-controlls.js";
import { Player } from "./player.js";

const canvas = document.querySelector('canvas');
// drawing context of the canvas element
const ctx = canvas.getContext('2d');
const dot = new Dot({ canvas, ctx })
const joystick = new Joystick({  })
const player = new Player({ canvas, ctx, dot, joystick })

//////////////////////////////////////////////////////////////////////////////
// Main Game Loop
//

joystick.setupJoystickControls()

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.checkCollision();
  player.draw();
  dot.drawDot();
  requestAnimationFrame(gameLoop);
};

gameLoop();
