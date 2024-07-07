export class Stats {
  constructor() {
    this.maxDots = 10
    this.dotAmout = 0
    this.money = 0
  }

  setupStats() {
    const statsContainer = document.createElement('stats-container');
    
    const moneyDisplay = document.createElement('money-display');
    const dotAmoutDisplay = document.createElement('dot-amout-display');
    
    moneyDisplay.textContent = `Money: ${this.money}`;
    dotAmoutDisplay.textContent = `Dots: ${this.dotAmout}/${this.maxDots}`;
    
    console.log(statsContainer);
    statsContainer.append(moneyDisplay, dotAmoutDisplay);
    document.body.appendChild(statsContainer);
  };
}
