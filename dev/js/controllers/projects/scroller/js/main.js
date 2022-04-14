import Scroller from './scroller/scroller.js';

;(function (win, doc) {
  function updateStyling (cssVars) {
    Object.entries(cssVars).forEach(cssVarSet => {
      const [ prop, value ] = cssVarSet;
      document.body.style.setProperty(`--${prop}`, `${value}px`);
    });
  }
  
  function eventListeners () {
    addEventListener('resize', updateStyling);
  }
  
  function initFns () {
    fetch('./js/controllers/projects/scroller/scroller_config.json')
      .then(res => res.json())
      .then(json => {
        const target = document.querySelector(json.target);
        const cssVars = {
          vh: win.innerHeight / 100,
          w: target.getBoundingClientRect().width / 100,
          h: target.getBoundingClientRect().height / 100
        };
        
        new Scroller({ ...json, debug: 0 });
        
        updateStyling(cssVars);
        eventListeners(cssVars);
      })
      .catch(err => console.log('ERROR:', err.message));
  }

  if (doc.readyState === 'complete') initFns();
  else doc.addEventListener('DOMContentLoaded', initFns);
})(window, window.document);