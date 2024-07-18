export class Navigation {
  constructor({ upgradeContainer, upgradeScreen }) {
    this.upgradeContainer = upgradeContainer
    this.upgradeScreen = upgradeScreen
    this.gameScreen = document.querySelector('game-screen');
    this.upgradeButton = document.querySelector('.upgrade-button');
    this.backButton = document.querySelector('.back-button');
  }

  goToUpgrades() {
    this.gameScreen.classList.add('hidden');
    this.upgradeScreen.classList.remove('hidden');
  };

  goToMain() {
    this.gameScreen.classList.remove('hidden');
    this.upgradeScreen.classList.add('hidden');
  };

  setup() {
    this.upgradeButton.addEventListener('click', () => this.goToUpgrades());
    this.backButton.addEventListener('click', () => this.goToMain());
  }
}