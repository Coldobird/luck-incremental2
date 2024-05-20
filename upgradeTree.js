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
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "-1";
    container.appendChild(svg);

    this.renderUpgrades();
    this.renderConnections();
  }

  renderUpgrades() {
    this.upgrades.filter(upgrade => !upgrade.dependencyId).forEach((upgrade, index) => {
      const upgradeElement = this.createUpgradeElement(upgrade, index);
      this.container.appendChild(upgradeElement);
    });
  }

  createUpgradeElement(upgrade, index) {
    const upgradeElement = document.createElement('div');
    upgradeElement.className = 'upgrade';
    upgradeElement.dataset.id = upgrade.id;
    upgradeElement.style.position = 'absolute';
    upgradeElement.style.left = `${index * 150}px`; // Position upgrades with some spacing
    upgradeElement.style.top = `${index * 100}px`;

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

    if (!parentElement || !childElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    const childRect = childElement.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
    const parentY = parentRect.top + parentRect.height / 2 - containerRect.top;
    const childX = childRect.left + childRect.width / 2 - containerRect.left;
    const childY = childRect.top + childRect.height / 2 - containerRect.top;

    const svg = this.container.querySelector('svg');
    if (!svg) return;

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

// Example usage
const upgrades = [
  { id: '1', name: 'Upgrade 1', upgrade: 'Effect 1', cost: 100, dependencyId: null },
  { id: '2', name: 'Upgrade 2', upgrade: 'Effect 2', cost: 200, dependencyId: '1' },
  { id: '3', name: 'Upgrade 3', upgrade: 'Effect 3', cost: 300, dependencyId: '1' },
  { id: '4', name: 'Upgrade 4', upgrade: 'Effect 4', cost: 400, dependencyId: '2' },
];

const container = document.getElementById('upgrade-container');
const upgradeTree = new UpgradeTree(upgrades);
upgradeTree.displayUpgradeTree(container);

// Example function to handle the upgrade button click
function handleUpgrade(upgradeId) {
  upgradeTree.handleUpgrade(upgradeId);
}
