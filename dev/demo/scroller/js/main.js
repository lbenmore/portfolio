import Scroller from './scroller/scroller.js';

;(function (win, doc) {
  function updateStyling () {
    document.body.style.setProperty('--vh', `${win.innerHeight / 100}px`);
  }
  
  function eventListeners () {
    addEventListener('resize', updateStyling);
  }
  
  function initFns () {
    updateStyling();
    eventListeners();
    
    fetch('./scroller_config.json')
      .then(res => res.json())
      .then(json => new Scroller({ ...json, debug: 1 }))
      .catch(err => console.log(err));
  }

  if (doc.readyState === 'complete') initFns();
  else doc.addEventListener('DOMContentLoaded', initFns);
})(window, window.document);