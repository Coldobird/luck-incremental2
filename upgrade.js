// upgrade.js
// Upgrade Screen Variables
const spawnDelayInfo = document.querySelector('spawn-delay-info')
let maxDots = 1000;
let spawnDelay = 5000

const gameState = {
  luck: 1,
  spawnRate: 1,
  max: 1,
  playerSpeed: 1,
};

const upgradeMaxDots = () => {
  maxDots++;
  updateDotCounter();
};

const upgradeSpawnDelay = (amount) => {
  if (amount) {
    spawnDelay = spawnDelay - amount
    spawnDelayInfo.textContent = `${spawnDelay} > ${spawnDelay - amount}`
  } else {
    spawnDelay = spawnDelay - 1
    spawnDelayInfo.textContent = `${spawnDelay} > ${spawnDelay - 1}`
  }
  startInterval()
};

