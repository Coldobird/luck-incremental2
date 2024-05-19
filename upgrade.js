// upgrade.js
// Upgrade Screen Variables
const backToGameButton = document.getElementById('back-to-game');
const upgradeScreen = document.getElementById('upgrade-screen');
const upgradeMaxDots = document.getElementById('upgrade-max-dots');

// Upgrade Screen Event Handlers and Logic
upgradeMaxDots.addEventListener('click', () => {
    maxDots++;
    updateDotCounter();
});

backToGameButton.addEventListener('click', () => {
    upgradeScreen.classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
});
