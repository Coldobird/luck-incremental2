import { Modal } from "./modal/Modal.js";
export class Navigation {
  constructor({ upgradeContainer, upgradeScreen }) {
    this.upgradeContainer = upgradeContainer
    this.upgradeScreen = upgradeScreen
    this.gameScreen = document.querySelector('game-screen');
    this.backButton = document.querySelector('.back-button');
    this.upgradeButton = document.querySelector('.nav-upgrade-button');
    this.resetButton = document.querySelector('.nav-reset-button');

    this.resetModal = new Modal({
      id: 'confirmation-modal',
      message: 'Are you sure you want to reset all progress?'
    });
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

    this.resetButton.addEventListener('click', () => {
      this.resetModal.onConfirm(() => {
        localStorage.clear();
        window.location.reload();
      });
      
      this.resetModal.onCancel(() => {
        this.resetModal.hide();
      });

      this.resetModal.show();
    });
  }
}