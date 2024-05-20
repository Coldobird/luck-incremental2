class UpgradeTree {
  constructor(upgrades) {
    this.upgrades = upgrades;
    this.upgradeMap = this.createUpgradeMap(upgrades);
    this.container = null;
  }

  createUpgradeMap(upgrades) {
    const map = new Map();
    upgrades.forEach(upgrade => {
      map.set(upgrade.id, upgrade);
      upgrade.children = [];
    });

    upgrades.forEach(upgrade => {
      if (upgrade.dependencyId) {
        const parent = map.get(upgrade.dependencyId);
        if (parent) parent.children.push(upgrade);
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
    upgradeElement.dataset.id = upgrade.id;

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
    upgradeButton.addEventListener('click', () => this.handleUpgrade(upgrade.id));
    upgradeElement.appendChild(upgradeButton);

    return upgradeElement;
  }

  renderUpgrades() {
    const levelContainers = {};
    const treeContainers = document.createElement('tree-containers');
    this.container.appendChild(treeContainers);


    this.upgrades.forEach(upgrade => {
      const dependencyId = upgrade.dependencyId || 0; // Use "root" for upgrades with no dependency
      if (!levelContainers[dependencyId]) {
        levelContainers[dependencyId] = document.createElement('level-container');
        levelContainers[dependencyId].classList.add(`level-${dependencyId}`); // Add class based on dependencyId
        treeContainers.appendChild(levelContainers[dependencyId]);
      }
    });
    this.upgrades.forEach(upgrade => {
      const dependencyId = upgrade.dependencyId || 0;
      const levelContainer = levelContainers[dependencyId];

      if (levelContainer) {
        const upgradeElement = this.createUpgradeElement(upgrade);
        levelContainer.appendChild(upgradeElement);
      }
    });

  }

  renderConnections() {
    this.upgrades.forEach(upgrade => {
      upgrade.children.forEach(child => {
        this.drawConnection(upgrade.id, child.id);
      });
    });
  }

  drawConnection(parentId, childId) {
    const parentElement = this.container.querySelector(`.upgrade[data-id='${parentId}']`);
    const childElement = this.container.querySelector(`.upgrade[data-id='${childId}']`);
    console.log(parentElement, childElement);

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
    }
  }
}

const upgrades = [
  { id: '1', name: 'Upgrade 1', upgrade: 'Effect 1', cost: 100, dependencyId: null },
  { id: '2', name: 'Upgrade 2', upgrade: 'Effect 2', cost: 200, dependencyId: '1' },
  { id: '3', name: 'Upgrade 3', upgrade: 'Effect 3', cost: 300, dependencyId: '1' },
  { id: '4', name: 'Upgrade 4', upgrade: 'Effect 4', cost: 400, dependencyId: '2' },
];

const container = document.getElementById('upgrade-container');
const upgradeTree = new UpgradeTree(upgrades);
upgradeTree.displayUpgradeTree(container);

function handleUpgrade(upgradeId) {
  upgradeTree.handleUpgrade(upgradeId);
}
