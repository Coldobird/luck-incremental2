import { Dot } from "./Dot.js";
import { Joystick } from "./joystick-controlls.js";
import { Navigation } from "./navigation.js";
import { Player } from "./player.js";
import stats from "./Stats.js";
import { UpgradeTree } from "./upgradeTree.js";
import { Grid } from "./Grid.js";
import { BackgroundManager } from "./BackgroundManager.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const upgradeContainer = document.getElementById('upgrade-container');
const upgradeScreen = document.querySelector('upgrade-screen');

const dots = [];
const isMobile = window.matchMedia("(pointer:none), (pointer:coarse)").matches;
let lastDotSpawnTime = -stats.multiSpawnRate;

const joystick = new Joystick({});
const grid = new Grid(20);
const player = new Player({ canvas, ctx, dots, joystick, stats, grid });
const upgradeTree = new UpgradeTree({ stats });
const navigation = new Navigation({ upgradeContainer, upgradeScreen });
const backgroundManager = new BackgroundManager(canvas, ctx);

//////////////////////////////////////////////////////////////////////////////
// On Load
//
if (isMobile) joystick.setupJoystickControls();
stats.setupStats();
navigation.setup();
upgradeTree.displayUpgradeTree(upgradeContainer, upgradeScreen);
backgroundManager.setup();

//////////////////////////////////////////////////////////////////////////////
// Main Game Loop
//
const gameLoop = (timestamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundManager.draw();
  player.update();
  player.checkCollision();
  player.draw();
  dots.forEach(dot => dot.drawDot());

  if (timestamp - lastDotSpawnTime > stats.multiSpawnRate) {
    Dot.spawnDots(stats.dotPerSpawn, { canvas, ctx, stats, dots, player, grid });
    lastDotSpawnTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
};

gameLoop();
