export class SVGButton {
  constructor(options) {
    this.options = Object.assign({
      defaultFill: '#A7BAA5',
      hoverFill: '#74C174',
      activeFill: '#52ab52',

      svg: null,
    }, options);

    this.button = document.createElement('button');
    if (this.options.class) this.button.className = this.options.class
    this.loadSVG();
  }

  loadSVG() {
    fetch(this.options.svg)
      .then(response => response.text())
      .then(svgContent => {
        this.button.innerHTML = svgContent;
        this.postProcessSVG();
      })
      .catch(error => console.error('Error loading SVG:', error));
  }

  postProcessSVG() {
    const svg = this.button.querySelector('svg');
    if (svg) {
      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('fill', this.options.defaultFill);
      });

      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const paths = this.button.querySelectorAll('svg path');

    this.button.addEventListener('mouseover', () => {
      paths.forEach(path => path.setAttribute('fill', this.options.hoverFill));
    });

    this.button.addEventListener('mouseout', () => {
      paths.forEach(path => path.setAttribute('fill', this.options.defaultFill));
    });

    this.button.addEventListener('mousedown', () => {
      paths.forEach(path => path.setAttribute('fill', this.options.activeFill));
    });

    this.button.addEventListener('mouseup', () => {
      paths.forEach(path => path.setAttribute('fill', this.options.hoverFill));
    });

    if (this.options.onClick) {
      this.button.addEventListener('click', () => {
        this.options.onClick()
      });
    }

  }

  getButton() {
    return this.button;
  }
}