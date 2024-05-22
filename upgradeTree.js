//upgradeTree.js
class UpgradeTree {
  constructor(upgrades) {
    this.upgrades = upgrades;
    this.upgradeMap = this.createUpgradeMap(upgrades);
    this.container = null;
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

  displayUpgradeTree(container) {
    this.container = container;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    container.appendChild(svg);

    this.renderUpgrades();
    this.renderConnections();
  }

  createUpgradeElement(upgrade) {
    const upgradeElement = document.createElement('div');
    upgradeElement.className = 'upgrade';
    upgradeElement.dataset.name = upgrade.name;

    const upgradeName = document.createElement('div');
    upgradeName.className = 'upgrade-name';
    upgradeName.textContent = upgrade.name;
    upgradeElement.appendChild(upgradeName);

    const upgradeCost = document.createElement('div');
    upgradeCost.className = 'upgrade-cost';
    upgradeCost.textContent = `Cost: ${upgrade.cost}`;
    upgradeElement.appendChild(upgradeCost);

    const upgradeButton = document.createElement('button');
    upgradeButton.className = 'upgrade-button';
    upgradeButton.textContent = 'Upgrade';
    upgradeButton.addEventListener('click', () => this.handleUpgrade(upgrade.name));
    upgradeElement.appendChild(upgradeButton);

    return upgradeElement;
  }

  renderUpgrades() {
    const levelContainers = {};
    const treeContainers = document.createElement('tree-containers');
    this.container.appendChild(treeContainers);

    this.upgrades.forEach(upgrade => {
      const layer = upgrade.layer;
      if (!levelContainers[layer]) {
        levelContainers[layer] = document.createElement('level-container');
        levelContainers[layer].classList.add(`level-${layer}`); // Add class based on linkTo
        treeContainers.appendChild(levelContainers[layer]);
      }
    });
    
    this.upgrades.forEach(upgrade => {
      const layer = upgrade.layer || 0;
      const levelContainer = levelContainers[layer];

      if (levelContainer) {
        const upgradeElement = this.createUpgradeElement(upgrade);
        levelContainer.appendChild(upgradeElement);
      }
    });
  }

  renderConnections() {
    this.upgrades.forEach(upgrade => {
      upgrade.children.forEach(child => {
        this.drawConnection(upgrade.name, child.name);
      });
    });
  }

  drawConnection(parentName, childName) {
    const parentElement = this.container.querySelector(`.upgrade[data-name='${parentName}']`);
    const childElement = this.container.querySelector(`.upgrade[data-name='${childName}']`);

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

  handleUpgrade(upgradeId) {
    const upgrade = this.upgradeMap.get(upgradeId);
    if (upgrade) {
      console.log(`Upgrading: ${upgrade.name}`);
      this.applyUpgrade(upgrade);
    }
  }

  applyUpgrade(upgrade) {
    const upgradeEffects = upgrade.upgrade.split(',').map(effect => effect.trim());

    upgradeEffects.forEach(effect => {
      const [key, value] = effect.split(' ').map(part => part.trim());
      const multiplier = parseFloat(key.slice(0, -1));

      if (value in gameState) {
        gameState[value] *= multiplier;
      }

      if (value == 'spawnRate') {
        startInterval()
      }
    });

    console.log('Updated game state:', gameState);
  }

  removeUpgradeTree() {
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }
}

// Example usage
const upgrades = [
  { name: 'Lucky 1', cost: 10, layer: '0', linkTo: null, upgrade: '2x luck' },
  { name: 'Lucky 2', cost: 25, layer: '1', linkTo: 'Lucky 1', upgrade: '2x luck' },
  { name: 'Lucky 3', cost: 50, layer: '2', linkTo: 'Lucky 2', upgrade: '1.5x luck' },
  { name: 'Upgrade 1', cost: 50, layer: '2', linkTo: 'Lucky 2', upgrade: '1.25x spawnRate, 2x max' },
  { name: '1.5x spawnRate', cost: 50, layer: '2', linkTo: 'Lucky 2', upgrade: '1.5x spawnRate' },
  { name: 'Lucky 4', cost: 250, layer: '3', linkTo: 'Lucky 3', upgrade: '3x luck' },
  { name: 'Upgrade 3', cost: 150, layer: '3', linkTo: 'Upgrade 1', upgrade: '2x playerSpeed, +.5 range' },
  { name: 'Upgrade 4', cost: 150, layer: '3', linkTo: 'Upgrade 1, 1.5x spawnRate', upgrade: '2x max' },
  { name: 'Upgrade 5', cost: 150, layer: '3', linkTo: '1.5x spawnRate', upgrade: '2x luck, 1.5x max' },

  { name: '+ luck', cost: 150, layer: '4', linkTo: 'Upgrade 3', upgrade: '2x luck' },
  { name: '+ max', cost: 150, layer: '4', linkTo: 'Upgrade 3', upgrade: '2x max' },
  { name: '+ playerSpeed', cost: 150, layer: '4', linkTo: 'Upgrade 3', upgrade: '2x playerSpeed' },
  { name: '+ spawnRate', cost: 150, layer: '4', linkTo: 'Upgrade 3', upgrade: '2x spawnRate' },
];

const container = document.getElementById('upgrade-container');
const upgradeTree = new UpgradeTree(upgrades);
