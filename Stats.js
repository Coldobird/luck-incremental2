export class Stats {
  constructor() {
    this.maxDots = 5
    this.dotAmount = 0
    this.money = 0
    this.multiMoney = 1
    this.multiSpeed = 1

    this.statsContainer = document.createElement('stats-container');
    this.moneyDisplay = document.createElement('money-display');
    this.dotAmountDisplay = document.createElement('dot-amount-display');
  }

  getMultiMoney() {
    console.log(this.multiMoney);
    return this.multiMoney;
  }

  setMultiMoney(value) {
    console.log(value);
    this.multiMoney = value;
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
