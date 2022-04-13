import Section from './section.js';

class Scroller {
  log (...args) {
    try {
      this.debug && console.log.apply(null, args);
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  renderSection (data) {
    try {
      this.active.remove(() => {
        this.active = new Section(data, this);
      });
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  onScroll (evt) {
    try {
      const { scrollTop } = evt.target;
      const { height: targetHeight } = this.target.getBoundingClientRect();
      const current = this.sections.reduce((result, section) => {
        if (result.section) return result;
        
        result.end = result.start + (targetHeight * section.height) - targetHeight;
        
        if (result.start < scrollTop && scrollTop < result.end) {
          result.section = section;
        } else {
          result.start += section.height * targetHeight - targetHeight;
        }
        
        return result;
      }, { start: 0, end: 0, section: null });
      
      const { section, start, end } = current;
      
      if (section) {
        const perc = (scrollTop - start) / (end - start);
        section.name !== this.active.config.name && this.renderSection(section);
        dispatchEvent(new CustomEvent(`scroller.${section.name}`, {
          detail: {
            current: section.name,
            ratio: scrollTop > 0 && perc || 0
          }
        }));
      }
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initEventListeners () {
    try {
      this.log('init event listeners');
      
      this.elements.main.addEventListener('scroll', this.onScroll.bind(this));
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initStyling () {
    try {
      this.log('init styling');
      
      const { width: targetWidth, height: targetHeight } = this.target.getBoundingClientRect();
      const heightMultiplier = this.sections.reduce((result, section ) => ((result += section.height) && result), 0);
      const width = `${targetWidth}px`;
      const height = `${targetHeight}px`;
      
      this.target.style.transform = 'translateZ(0)';
      
      Object.assign(this.elements.main.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: width,
        height: height,
        overflow: 'auto'
      });
      
      Object.assign(this.elements.container.style, {
        position: 'relative',
        width: '100%',
        height: `${targetHeight * heightMultiplier}px`,
        pointerEvents: 'none'
      });
      
      this.sections.forEach(section => {
        Object.assign(section.container.style, {
          height: `${targetHeight * section.height}px`
        });
      })
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initContent () {
    try {
      this.log('init content');
      this.id = Math.random().toString(16).slice(2);
      this.elements.main = document.createElement('main');
      this.elements.container = document.createElement('div');
      this.elements.sections = this.sections.map(section => document.createElement('section'));
      
      this.elements.sections.forEach((section, i) => {
        this.sections[i].container = section;
        this.elements.container.appendChild(section);
      });
      
      this.elements.main.appendChild(this.elements.container);
      this.target.appendChild(this.elements.main);
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  constructor (config) {
    try {
      this.debug = config.hasOwnProperty('debug') ? config.debug : 0;
      this.target = config.target && document.querySelector(config.target) || document.body;
      this.sections = config.sections;
      this.elements = {};
      
      this.log('constructor', config);
      
      this.initContent();
      this.initStyling();
      this.initEventListeners();
      
      this.active = new Section(this.sections[0], this);
      
      window.scroller = this;
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
}

export default Scroller;