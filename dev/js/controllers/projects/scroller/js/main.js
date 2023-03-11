import Scroller from './scroller/scroller.js';

;(function (win, doc) {
  function getCssVars (target) {
    return {
      vh: win.innerHeight / 100,
      w: target.getBoundingClientRect().width / 100,
      h: target.getBoundingClientRect().height / 100
    };
  }
  
  function updateStyling (target) {
    const cssVars = getCssVars(target);
    Object.entries(cssVars).forEach(cssVarSet => {
      const [ prop, value ] = cssVarSet;
      doc.body.style.setProperty(`--${prop}`, `${value}px`);
    });
  }
  
  function eventListeners (target) {
    addEventListener('resize', updateStyling.bind(this, target));
  }
  
  function initFns () {
    fetch('./js/controllers/projects/scroller/scroller_config.json')
      .then(res => res.json())
      .then(json => {
        const target = doc.querySelector(json.target);
        
        new Scroller({ ...json, debug: 0 });
        
        updateStyling(target);
        eventListeners(target);
      })
      .catch(err => console.log('ERROR:', err.message));
  }

  if (doc.readyState === 'complete') initFns();
  else doc.addEventListener('DOMContentLoaded', initFns);
})(window, window.document);