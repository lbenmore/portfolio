class Snowflake {
  destroy () {
    clearInterval(this.animInterval);
    this.container.parentNode && this.container.parentNode.removeChild(this.container);
  }
  
  go () {
    const maxX = 20;
    
    this.rotation = this.rotation < 355 ? this.rotation + 5 : 0;
    this.shiftX = this.shiftXIncreasing
      ? this.shiftX < maxX
        ? ++this.shiftX
        : (this.shiftXIncreasing = !this.shiftXIncreasing, maxX)
      : this.shiftX > maxX * -1
        ? --this.shiftX
        : (this.shiftXIncreasing = !this.shiftXIncreasing, maxX * -1)
    
    Object.assign(this.container.style, {
      top: `${this.y += 2}px`
    });
    
    Object.assign(this.element.style, {
      transform: `
        translateX(${this.shiftX}px) 
        rotate${this.rotationAxis}(${this.rotation * this.rotationPositivity}deg)
      `
    });
  }
  
  initAnim (options) {
    this.animInterval = setInterval(() => {
      const maxY = this.target.getBoundingClientRect().height;
      
      if (this.y < maxY) requestAnimationFrame(this.go.bind(this));
      else this.y = this.size * -1;
    }, this.speed);
  }
  
  stylize () {
    const targetWidth = this.target.getBoundingClientRect().width;
    const targetPosition = getComputedStyle(this.target).position;

    Object.assign(this.target.style, {
      position: !targetPosition || targetPosition === 'static' ? 'relative' : targetPosition,
      transformStyle: 'preserve-3d',
      perspective: `${targetWidth}px`
    });
    
    Object.assign(this.container.style, {
      position: 'absolute',
      top: `${this.y}px`,
      left: `${Math.floor(Math.random() * targetWidth)}px`
    });
    
    Object.assign(this.element.style, {
      width: '2px',
      height: `${this.size}px`,
      backgroundColor: `${this.color}`,
      borderRadius: '50%',
      backgroundColor: `${this.color}`,
      borderRadius: '50%',
      transform: `rotate${this.rotationAxis}(${this.rotation}deg)`
    });
    
    this.element.querySelectorAll('span').forEach((spoke, i) => {
      Object.assign(spoke.style, {
        display: 'block',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'inherit',
        borderRadius: 'inherit',
        transform: `rotate(${!!i ? '-' : ''}60deg)`
      });
    });
  }
  
  addToDOM () {
    const [ spoke1, spoke2 ] = Array(2).fill('span').map(x => document.createElement(x));
    
    this.container = document.createElement('div');
    this.element = document.createElement('div');
    
    [ spoke1, spoke2 ].forEach(x => this.element.appendChild(x));
    this.container.appendChild(this.element);
    this.target.appendChild(this.container);
  }
  
  constructor (target, options = {}) {
    const rotations = ['X', 'Y', 'Z'];
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    
    this.target = target;
    this.speed = options.speed || rand(25, 75);
    this.color = options.color || '#cdf';
    this.size = rand(20, 40);
    this.rotation = rand(0, 360);
    this.rotationAxis = rotations[rand(0, rotations.length)];
    this.rotationPositivity = Math.round(Math.random()) ? 1 : -1;
    this.shiftX = 0;
    this.shiftXIncreasing = !!Math.round(Math.random());
    this.y = rand(this.size * -1, this.target.getBoundingClientRect().height);
    this.animInterval = null;
    this.container = null;
    this.element = null;
  
    this.addToDOM();
    this.stylize();
    this.initAnim(options);
    
    window.addEventListener('error', () => {
      clearInterval(this.animInterval);
    });
  }
}

export default Snowflake;