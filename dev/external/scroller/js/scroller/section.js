class Section {
  log (...args) {
    try {
      this.scroller.debug && console.log.apply(null, [ this.config.name.toUpperCase(), ...args ]);
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  remove (callback) {
    try {
      this.log('remove');
      
      this.elements.container.parentNode.removeChild(this.elements.container);
      this.stylesheets.forEach(ss => ss.parentNode.removeChild(ss));
      this.scripts.forEach(s => s.parentNode.removeChild(s));
      
      callback && typeof callback === 'function' && callback();
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initScripts (paths) {
    try {
      const that = this;
      
      that.log('init scripts', paths);
      
      that.scripts = [];
      
      paths.forEach((path, index) => {
        const script = document.createElement('script');
        script.type = 'module';
        
        script.onload = () => that.log('loaded script', path);
        script.onerror = () => that.log('errored script', path);
        
        fetch(path)
          .then(res => res.text())
          .then(content => {
            script.innerHTML = `
              ;(function (win, doc) {
                ${content}
                try { win.addEventListener('scroller.${that.config.name}', onScroll); } catch (err) { }
              })(window, window.document);
            `;
            document.body.appendChild(script);
            that.scripts.push(script);
          });
      });
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initStylesheets (paths) {
    try {
      this.log('init stylesheets', paths);
      
      this.ss = [];
      paths.forEach(path => {
        fetch(path)
          .then(res => res.text())
          .then(content => {
            const style = document.createElement('style');
            this.ss.push(style);
            style.innerHTML = content;
            document.head.appendChild(style);
          });
      });
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  initContent (path) {
    try {
      this.log('init content', path);
      this.elements.container = document.createElement('div');
      
      fetch(path)
        .then(res => res.text())
        .then(html => {
          this.elements.container.innerHTML = html;
          
          Object.assign(this.elements.container.style, {
            width: '100%',
            height: '100%'
          });
      
          this.config.container.appendChild(this.elements.container);
          this.elements.container.classList.add(`section--${this.config.name}${this.scroller.id}`);
        });
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
  
  constructor (section, scroller) {
    try {
      this.scroller = scroller;
      this.config = section;
      this.log('constructor', section);
      
      this.elements = {};
      this.stylesheets = [];
      this.scripts = [];
      
      this.initContent(this.config.content.html);
      this.initStylesheets(this.config.content.css);
      this.initScripts(this.config.content.js);
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }
}

export default Section;