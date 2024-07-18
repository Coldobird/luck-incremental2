export class Navigation {
  constructor({ upgradeContainer }) {
    this.upgradeContainer = upgradeContainer
    this.gameScreen = document.querySelector('game-screen');
    this.upgradeScreen = document.querySelector('upgrade-screen');
    this.upgradeButton = document.querySelector('.upgrade-button');
    this.backButton = document.querySelector('.back-button');
  }

  goToUpgrades() {
    this.gameScreen.classList.add('hidden');
    this.upgradeScreen.classList.remove('hidden');
    this.upgradeContainer.classList.remove('hidden');
  };

  goToMain() {
    this.upgradeContainer.classList.add('hidden');
    this.upgradeScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');
  };

  setup() {
    this.upgradeButton.addEventListener('click', () => this.goToUpgrades());
    this.backButton.addEventListener('click', () => this.goToMain());
  }
}