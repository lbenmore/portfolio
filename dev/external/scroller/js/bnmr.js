(function (win, doc) {
  const $$ = (selector, forceArray, context) => {
    const el = selector instanceof Window || selector instanceof HTMLDocument || selector instanceof HTMLBodyElement || selector instanceof HTMLElement
      ? selector
      : forceArray || doc.querySelectorAll(selector).length > 1
        ? Object.keys(doc.querySelectorAll(selector)).map(x => doc.querySelectorAll(selector)[x])
        : doc.querySelector(selector);
        
    function evalTouchEvents (el, evtName, fn, origEvt, endEvt) {
      const isMobile = $$.isMobile();
      const startX = isMobile ? origEvt.changedTouches[0].clientX : origEvt.clientX;
      const endX = isMobile ? endEvt.changedTouches[0].clientX : endEvt.clientX;
      const startY = isMobile ? origEvt.changedTouches[0].clientY : origEvt.clientY;
      const endY = isMobile ? endEvt.changedTouches[0].clientY : endEvt.clientY;
      const finalEvt = { ...endEvt };
      let trigger = false;
      
      finalEvt.originalEvent = origEvt;
      finalEvt.type = evtName;
        
      switch (evtName) {
        case 'swipeup':
          trigger = startY - endY > 100 && Math.abs(startX - endX) < 20;
          break;
        case 'swipedown':
          trigger = endY - startY > 100 && Math.abs(startX - endX) < 20;
          break;
        case 'swipeleft':
          trigger = startX - endX > 100 && Math.abs(startY - endY) < 20;
          break;
        case 'swiperight':
          trigger = endX - startX > 100 && Math.abs(startY - endY) < 20;
          break;
      }
      
      trigger && fn(finalEvt);
    }
        
    function initTouchEvents (el, evtName, fn) {
      const isMobile = $$.isMobile();
      const startEvt = isMobile ? 'touchstart' : 'mousedown';
      const endEvt = isMobile ? 'touchend' : 'mouseup';
      
      $$(el).on(startEvt, origEvt => {
        $$(el).once(endEvt, evalTouchEvents.bind(this, el, evtName, fn, origEvt));
      });
    }
    
    if (el) {
      el.off = (evtName, fn) => {
        if (el.length) {
          el.forEach(_el => $$(_el).off(evtName, fn));
          return el;
        }
        
        el.removeEventListener(evtName, fn);
        
        return el;
      };
      
      el.on = (evtName, fn, opts) => {
        if (el.length) {
          el.forEach(_el => $$(_el).on(evt, fn, opts));
          return el;
        }
        
        switch (evtName) {
          case 'swipeup':
          case 'swipedown':
          case 'swipeleft':
          case 'swiperight':
            initTouchEvents(el, evtName, fn);
            break;
          
          default:
            el.addEventListener(evtName, fn, opts);
        }
        
        return el;
      };
      
      el.once = (evtName, fn) => {
        if (el.length) {
          el.forEach(_el => $$(_el).once(evtName, fn));
          return el;
        }
        
        function callback (evt) {
          fn(evt);
          $$(el).off(evtName, callback);
        }
        
        el.addEventListener(evtName, callback);
        
        return el;
      };
      
      el.css = (property, value, delay, callback) => {
        if (el.length) {
          el.forEach(_el => $$(_el).css(property, value, delay, callback));
          return el;
        }
        
        const props = {};
        let del;
        let cb;
        
        if (typeof property === 'object') {
          for (const _ in property) props[_] = property[_];
          del = typeof value === 'number' ? value : 0;
          cb = typeof value === 'function' ? value : typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : function () {};
        } else {
          props[property] = value;
          del = typeof delay === 'number' ? delay : 0;
          cb = typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : function () {};
        }
        
        setTimeout(() => {
          for (const _ in props) el.style[_] = props[_];
        }, del);
        
        return el;
      };
      
      el.animate = (properties, duration, delay, ease, callback) => {
        if (el.length) {
          el.forEach(_el => $$(_el).animate(properties, duration, delay, ease, callback));
          return el;
        }
        
        const props = { ...properties };
        const dur = typeof duration === 'number' ? duration : 500;
        const del = typeof delay === 'number' ? delay : 0;
        const eas = typeof duration === 'string' ? duration : typeof delay === 'string' ? delay : typeof ease === 'string' ? ease : 'ease';
        const cb = typeof duration === 'function ' ? duration : typeof delay === 'function' ? delay : typeof ease === 'function' ? ease : typeof callback === 'function' ? callback : function () {};
        const setTime = del >= 20 ? del - 20 : del;
        const execTime = setTime + 20;
        let transition = '';
        
        for (const _ in props) {
          transition += `${_} ${dur}ms ${eas}, `;
          $$(el).css(_, props[_], execTime);
        }
        transition = transition.slice(0, -2);
        
        $$(el).css({ transition }, setTime);
        
        setTimeout(() => {
          $$(el).css('transition', 'none');
          cb.call(el);
        }, execTime + dur);
        
        return el;
      };
      
      el.raf = (property, endValue, speed, callback) => {
        if (el.length) {
          el.forEach(_el => $$(_el).raf(property, endValue, speed));
          return el;
        }
        
        const prop = property;
        const max = endValue;
        const denc = speed || 1;
        const cb = callback || function () {};
        const currVal = el.getBoundingClientRect()[prop];
        console.log(currVal, speed, currVal + speed);
        
        if (
          (speed > 0 && currVal < max) ||
          (speed < 0 && currVal > max)
        ) {
          $$(el).css(prop, currVal + speed + 'px');
          win.requestAnimationFrame(el.raf.bind(el, property, endValue, speed));
        } else {
          cb.call(el);
        }
      };
    }
    
    return el;
  };
  
  $$.ajax = () => {
    
  };
  
  $$.isMobile = () => !!('ontouchstart' in window);
  
  $$.log = (...args) => {
    let label = '';
    try {
      const err = new Error();
      console.log(Object.keys(err));
      // const { stack } = err;
      // const lines = stack.split('\n');
      // for (const _ of lines) console.log(_);
      // const [ match, fileName, lineNo, charNo] = lines[0].match(/(?:.*?)\.((.*?).js):(.*?):(.*?)/);
      // console.log(fileName, lineNo, charNo);
    } catch (e) {
      console.error(e);
    }
    
    console.log.apply(this, [ label, ...args ]);
  };
  
  $$.preload = () => {
    
  };
  
  win.$$ = $$;
})(window, window.document);