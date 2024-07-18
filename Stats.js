class Stats {
  constructor() {
    this.maxDots = 5
    this.dotAmount = 0
    this.money = 0
    this.multiMoney = 1
    this.multiSpeed = 1
    this.multiRange = 20
    this.multiSpawnRate = 2000

    this.statsContainer = document.createElement('stats-container');
    this.moneyDisplay = document.createElement('money-display');
    this.dotAmountDisplay = document.createElement('dot-amount-display');
  }

  getAllStats() {
    return {
      multiMoney: this.multiMoney,
      multiSpawnRate: this.multiSpawnRate,
      maxDots: this.maxDots,
      multiSpeed: this.multiSpeed,
      multiRange: this.multiRange,
      money: this.money,
    };
  }
  
  saveStats() {
    localStorage.setItem('stats', JSON.stringify(this.getAllStats()));
  }

  setAllStats(stats) {
    this.multiMoney = stats.multiMoney;
    this.multiSpawnRate = stats.multiSpawnRate;
    this.maxDots = stats.maxDots;
    this.multiSpeed = stats.multiSpeed;
    this.multiRange = stats.multiRange;
    this.money = stats.money;
  }

  getMoney() {
    return this.money;
  }

  setMoney(value) {
    this.money = value;
    this.updateMoneyDisplay()
  }

  setupStats() {
    this.moneyDisplay.textContent = `Money: ${this.money}`;
    this.dotAmountDisplay.textContent = `Dots: ${this.dotAmount}/${this.maxDots}`;

    this.statsContainer.append(this.moneyDisplay, this.dotAmountDisplay);
    document.body.appendChild(this.statsContainer);
  };

  updateMoneyDisplay() {
    this.moneyDisplay.textContent = `Money: ${this.money}`;
  }

  updateDotAmountDisplay() {
    this.dotAmountDisplay.textContent = `Dots: ${this.dotAmount}/${this.maxDots}`;
  }
}

const statsInstance = new Stats();
export default statsInstance;
