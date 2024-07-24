//upgradeTree.js
const upgrades = [
  { name: 'Upgrade 1', cost: 10, layer: '0', linkTo: null, upgrade: [{ type: 'luck', value: 2 }] },

  { name: 'Upgrade 2', cost: 25, layer: '1', linkTo: 'Upgrade 1', upgrade: [{ type: 'luck', value: 2 }] },

  { name: 'Upgrade 3', cost: 50, layer: '2', linkTo: 'Upgrade 2', upgrade: [{ type: 'luck', value: 1.25 }] },
  { name: 'Upgrade 4', cost: 50, layer: '2', linkTo: 'Upgrade 2', upgrade: [{ type: 'spawn rate', value: 1.25 }, { type: 'max dots', value: 2 }] },
  { name: 'Upgrade 5', cost: 50, layer: '2', linkTo: 'Upgrade 2', upgrade: [{ type: 'spawn rate', value: 1.5 }] },

  { name: 'Upgrade 6', cost: 250, layer: '3', linkTo: 'Upgrade 3', upgrade: [{ type: 'luck', value: 2.5 }] },
  { name: 'Upgrade 7', cost: 150, layer: '3', linkTo: 'Upgrade 4', upgrade: [{ type: 'spawn rate', value: 1.5 }, { type: 'player range', value: 10 }] },
  { name: 'Upgrade 8', cost: 75, layer: '3', linkTo: 'Upgrade 4, Upgrade 5', upgrade: [{ type: 'max dots', value: 2 }] },
  { name: 'Upgrade 9', cost: 200, layer: '3', linkTo: 'Upgrade 5', upgrade: [{ type: 'luck', value: 2 }, { type: 'max dots', value: 1.5 }] },

  { name: 'Upgrade 10', cost: 1200, layer: '4', linkTo: 'Upgrade 7', upgrade: [{ type: 'luck', value: 1.5 }] },
  { name: 'Upgrade 11', cost: 1250, layer: '4', linkTo: 'Upgrade 7', upgrade: [{ type: 'spawn rate', value: 1.2 }, { type: 'max dots', value: 1.2 }] },
  { name: 'Upgrade 12', cost: 1000, layer: '4', linkTo: 'Upgrade 7', upgrade: [{ type: 'player speed', value: 1.1 }, { type: 'player range', value: 5 }] },
  { name: 'Upgrade 13', cost: 1000, layer: '4', linkTo: 'Upgrade 7', upgrade: [{ type: 'spawn rate', value: 1.25 }] },
];

export class UpgradeTree {
  constructor({ stats }) {
    this.upgradeMap = this.createUpgradeMap(upgrades);
    this.container = null;
    this.stats = stats;

    this.disabledUpgrades = this.loadDisabledUpgrades();
    this.loadStats();
  }


  createUpgradeMap(upgrades) {
    const map = new Map();
    upgrades.forEach(upgrade => {
      map.set(upgrade.name, upgrade);
      upgrade.children = [];
    });

    upgrades.forEach(upgrade => {
      if (upgrade.linkTo) {
        const parentNames = upgrade.linkTo.split(',').map(name => name.trim());
        parentNames.forEach(parentName => {
          const parent = map.get(parentName);
          if (parent) parent.children.push(upgrade);
        });
      }
    });

    return map;
  }

  displayUpgradeTree(container, upgradeScreen) {
    this.container = container;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    container.appendChild(svg);

    this.renderUpgrades();
    this.renderConnections();
    upgradeScreen.classList.add('hidden');
  }

  isUpgradeBuyable(upgrade) {
    if (!upgrade.linkTo) return true;

    const parentNames = upgrade.linkTo.split(',').map(name => name.trim());
    return parentNames.every(parentName => this.disabledUpgrades.includes(parentName));
  }

  updateUpgradeVisibility() {
    upgrades.forEach(upgrade => {
      const upgradeElement = this.container.querySelector(`.upgrade[data-name='${upgrade.name}']`);
      if (upgradeElement && this.isUpgradeBuyable(upgrade)) {
        upgradeElement.classList.remove('invisible');
      }
    });
  }
  
  createUpgradeElement(upgrade) {
    const upgradeElement = document.createElement('upgrade-element');
    upgradeElement.dataset.name = upgrade.name;
  
    const upgradeName = document.createElement('upgrade-name');
    upgradeName.textContent = upgrade.name;
    upgradeElement.appendChild(upgradeName);
  
    const upgradeFunction = document.createElement('upgrade-function');
    
    upgrade.upgrade.forEach(effect => {
      const effectElement = document.createElement('div');
      effectElement.textContent = `${effect.type}: ${effect.value}x`;
      upgradeFunction.appendChild(effectElement);
    });
  
    upgradeElement.appendChild(upgradeFunction);
  
    const upgradeCost = document.createElement('upgrade-cost');
    upgradeCost.textContent = `Cost: ${upgrade.cost}`;
    upgradeElement.appendChild(upgradeCost);
  
    const upgradeButton = document.createElement('button');
    upgradeButton.className = 'upgrade-button';
    upgradeButton.textContent = 'Upgrade';
  
    if (!this.isUpgradeBuyable(upgrade)) {
      upgradeElement.classList.add('invisible');
    }
  
    if (this.disabledUpgrades.includes(upgrade.name)) {
      upgradeButton.disabled = true;
      upgradeElement.classList.add('disabled');
    }
    upgradeButton.addEventListener('click', () => this.handleUpgrade(upgrade.name, upgradeElement, upgradeButton));
    upgradeElement.appendChild(upgradeButton);
  
    return upgradeElement;
  }

  renderUpgrades() {
    const levelContainers = {};
    const treeContainers = document.createElement('tree-containers');
    this.container.appendChild(treeContainers);
  
    upgrades.forEach(upgrade => {
      const layer = upgrade.layer;
      if (!levelContainers[layer]) {
        levelContainers[layer] = document.createElement('level-container');
        levelContainers[layer].classList.add(`level-${layer}`);
        treeContainers.appendChild(levelContainers[layer]);
      }
    });
  
    upgrades.forEach(upgrade => {
      const layer = upgrade.layer || 0;
      const levelContainer = levelContainers[layer];
  
      if (levelContainer) {
        const upgradeElement = this.createUpgradeElement(upgrade);
        levelContainer.appendChild(upgradeElement);
      }
    });
  
    this.updateUpgradeVisibility();
  }

  renderConnections() {
    const svg = this.container.querySelector('svg');
    svg.innerHTML = ''; // Clear existing connections
    upgrades.forEach(upgrade => {
      if (!this.container.querySelector(`upgrade-element[data-name='${upgrade.name}']`).classList.contains('invisible')) {
        upgrade.children.forEach(child => {
          if (!this.container.querySelector(`upgrade-element[data-name='${child.name}']`).classList.contains('invisible')) {
            this.drawConnection(upgrade.name, child.name);
          }
        });
      }
    });
  }

  drawConnection(parentName, childName) {
    const parentElement = this.container.querySelector(`upgrade-element[data-name='${parentName}']`);
    const childElement = this.container.querySelector(`upgrade-element[data-name='${childName}']`);

    if (!parentElement || !childElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const childRect = childElement.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
    const parentY = parentRect.top + parentRect.height / 2 - containerRect.top;
    const childX = childRect.left + childRect.width / 2 - containerRect.left;
    const childY = childRect.top + childRect.height / 2 - containerRect.top;

    const svg = this.container.querySelector('svg');

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", parentX);
    line.setAttribute("y1", parentY);
    line.setAttribute("x2", childX);
    line.setAttribute("y2", childY);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }

  handleUpgrade(upgradeId, upgradeElement, button) {
    const upgrade = this.upgradeMap.get(upgradeId);
    if (upgrade) {
      const playerMoney = this.stats.getMoney();
      if (playerMoney >= upgrade.cost) {
        this.stats.setMoney(playerMoney - upgrade.cost);
        this.applyUpgrade(upgrade);
        upgradeElement.classList.add('disabled');
        button.disabled = true;
        this.saveUpgradeState(upgrade.name);
        this.updateUpgradeVisibility();
        this.renderConnections(); // Re-render connections to account for new visible upgrades
      }
    }
  }

applyUpgrade(upgrade) {
  upgrade.upgrade.forEach(({ type, value }) => {
    switch (type) {
      case 'luck':
        this.stats.multiMoney *= value;
        break;
      case 'spawn rate':
        this.stats.multiSpawnRate /= value;
        break;
      case 'max dots':
        this.stats.maxDots *= value;
        break;
      case 'playerSpeed':
        this.stats.multiSpeed *= value;
        break;
      case 'player range':
        this.stats.multiRange += value;
        break;
      default:
        break;
    }
  });

  this.stats.saveStats();
}
  
  loadStats() {
    const savedStats = JSON.parse(localStorage.getItem('stats'));
    if (savedStats) {
      this.stats.setAllStats(savedStats);
    }
  }
  
  saveDisabledUpgrade(upgradeName) {
    this.disabledUpgrades.push(upgradeName);
    localStorage.setItem('disabledUpgrades', JSON.stringify(this.disabledUpgrades));
  }

  saveUpgradeState(upgradeName) {
    let disabledUpgrades = JSON.parse(localStorage.getItem('disabledUpgrades')) || [];
    if (!disabledUpgrades.includes(upgradeName)) {
      disabledUpgrades.push(upgradeName);
      localStorage.setItem('disabledUpgrades', JSON.stringify(disabledUpgrades));
      this.saveDisabledUpgrade(upgradeName)
    }
  }
  
  loadDisabledUpgrades() {
    const disabledUpgrades = JSON.parse(localStorage.getItem('disabledUpgrades')) || [];
    disabledUpgrades.forEach(upgradeName => {
      const upgradeElement = this.container?.querySelector(`.upgrade[data-name='${upgradeName}']`);
      if (upgradeElement) {
        const button = upgradeElement.querySelector('.upgrade-button');
        upgradeElement.classList.add('disabled');
        button.disabled = true;
      }
    });
    return JSON.parse(localStorage.getItem('disabledUpgrades')) || [];
  }

  removeUpgradeTree() {
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }
}
