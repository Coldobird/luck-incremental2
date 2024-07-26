import { Modal } from "./modal/Modal.js";
import { SVGButton } from "./SVGButton.js";

export class Navigation {
  constructor({ upgradeScreen }) {
    this.upgradeScreen = upgradeScreen;
    this.gameScreen = document.querySelector('game-screen');
    this.resetModal = new Modal({
      id: 'confirmation-modal',
      message: 'Are you sure you want to reset all progress?'
    });
    this.createNavigationMenu();
  }

  createNavigationMenu() {
    this.navMenu = document.createElement('navigation-menu');
    
    const mainButtonContainer = document.createElement('navigation-container');
    this.navMenu.appendChild(mainButtonContainer);

    const navBg = document.createElement('simple-nav-bg');
    mainButtonContainer.appendChild(navBg);

    this.createButton({
      svg: '/midia/svg/IconUpgradeBtn.svg',
      class: 'nav-button main',
      onClick: () => this.toggleScreen(false),
    }, mainButtonContainer);

    const contentContainer = document.createElement('navigation-container');
    this.navMenu.appendChild(contentContainer);

    const bgImg = document.createElement('img');
    bgImg.src = "/midia/svg/NavMenuBg.svg";
    bgImg.alt = "";
    contentContainer.appendChild(bgImg);

    this.navSpacing = document.createElement('navigation-spacing');
    contentContainer.appendChild(this.navSpacing);

    document.body.appendChild(this.navMenu);

  }

  createButton({ svg, class: className, onClick }, parent = this.navSpacing) {
    const button = new SVGButton({ svg, class: className, onClick });
    parent.appendChild(button.getButton());
    return button;
  }

  toggleScreen(showUpgrade) {
    this.gameScreen.classList.toggle('hidden', showUpgrade);
    this.upgradeScreen.classList.toggle('hidden', !showUpgrade);
  }

  setup() {
    this.createButton({
      svg: '/midia/svg/IconUpgradeBtn.svg',
      class: 'nav-button',
      onClick: () => this.toggleScreen(true),
    });

    this.createButton({
      svg: '/midia/svg/IconResetBtn.svg',
      class: 'nav-button nav-reset-button',
      onClick: () => {
        this.resetModal.onConfirm(() => {
          localStorage.clear();
          window.location.reload();
        });
        this.resetModal.onCancel(() => this.resetModal.hide());
        this.resetModal.show();
      },
    });
  }
}