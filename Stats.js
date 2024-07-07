export class Stats {
  constructor() {
    this.maxDots = 10
    this.dotAmout = 0
    this.money = 0

    this.statsContainer = document.createElement('stats-container');
    this.moneyDisplay = document.createElement('money-display');
    this.dotAmoutDisplay = document.createElement('dot-amout-display');
  }

  setupStats() {

    this.moneyDisplay.textContent = `Money: ${this.money}`;
    this.dotAmoutDisplay.textContent = `Dots: ${this.dotAmout}/${this.maxDots}`;

    console.log(this.statsContainer);
    this.statsContainer.append(this.moneyDisplay, this.dotAmoutDisplay);
    document.body.appendChild(this.statsContainer);
  };

  updateMoneyDisplay(amount) {
    this.money += amount;
    this.moneyDisplay.textContent = `Money: ${this.money}`;
  }
}
