import * as utils from './utils.js';

const $$ = (selector, forceArray, context) => {
  const win = window;
  const doc = win.document;
  const ctx = context || doc;
  const el = selector instanceof Window || selector instanceof HTMLDocument || selector instanceof HTMLBodyElement || selector instanceof HTMLElement ?
    selector :
    forceArray || ctx.querySelectorAll(selector).length > 1 ?
      Object.keys(ctx.querySelectorAll(selector)).map(x => ctx.querySelectorAll(selector)[x]) :
      ctx.querySelector(selector);

  if (!el) return null;

  function evalTouchEvent (el, evtName, fn, origEvt, endEvt) {
    const isTouchDevice = utils.isTouchDevice();
    const resultEvt = {};
    const points = {
      x: {
        start: isTouchDevice ? origEvt.changedTouches[0].clientX : origEvt.clientX,
        end: isTouchDevice ? endEvt.changedTouches[0].clientX : endEvt.clientX
      },
      y: {
        start: isTouchDevice ? origEvt.changedTouches[0].clientY : origEvt.clientY,
        end: isTouchDevice ? endEvt.changedTouches[0].clientY : endEvt.clientY
      }
    };

    let trigger = !1;

    switch (evtName) {
      case 'swipeup':
        trigger = !!(points.y.start - points.y.end >= 100 && Math.abs(points.x.start - points.x.end) <= 20);
        break;
      case 'swiperight':
        trigger = !!(points.x.end - points.x.start >= 100 && Math.abs(points.y.start - points.y.end) <= 20);
        break;
      case 'swipebottom':
        trigger = !!(points.y.end - points.y.start >= 100 && Math.abs(points.x.start - points.x.end) <= 20);
        break;
      case 'swipeleft':
        trigger = !!(points.x.start - points.x.end >= 100 && Math.abs(points.y.start - points.y.end) <= 20);
        break;
    }

    if (trigger) {
      for (const _ in endEvt) resultEvt[_] = endEvt[_];
      resultEvt.originalEvent = origEvt;
      resultEvt.type = evtName;
      fn.call(el, resultEvt);
    }
  }

  function initTouchEvent (el, evtName, fn) {
    const isTouchDevice = utils.isTouchDevice();
    const startEvtName = isTouchDevice ? 'touchstart' : 'mousedown';
    const endEvtName = isTouchDevice ? 'touchend' : 'mouseup';
    
    $$(el).on(startEvtName, origEvt => {
      $$(el).once(endEvtName, endEvt => {
        evalTouchEvent(el, evtName, fn, origEvt, endEvt);
      });
    });
  }
  
  el.$$ = function (selector, forceArray) {
    if (el.length) {
      const result = [];
      el.forEach(_el => {
        result.push(...$$(selector, true, _el))
      });
      return !result.length ? null : result.length === 1 ? result[0] : result;
    }
    
    return $$(selector, forceArray, el);
  };

  el.css = function (property, value, delay, callback) {
    if (el.length) {
      el.forEach(_el => $$(_el).css(property, value, delay, callback));
      return el;
    }
    
    const props = {};
    let del;
    let cb;

    if (typeof property === 'object') {
      for (const _ in property) props[_] = property[_];
      del = typeof value === 'number' ? value : typeof delay === 'number' ? delay : 0;
      cb = typeof value === 'function' ? value : typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : function () {};
    } else {
      props[property] = value;
      del = typeof delay === 'number' ? delay : 0;
      cb = typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : function () {};
    }

    setTimeout(() => {
      for (const _ in props) el.style[_] = props[_];
      cb.call(el);
    }, del);

    return el;
  };

  el.animate = function (properties, duration, delay, ease, callback) {
    if (el.length) {
      el.forEach(_el => $$(_el).animate(properties, duration, delay, ease, callback));
      return el;
    }

    const props = { ...properties };
    const dur = typeof duration === 'number' ? duration : 500;
    const del = typeof delay === 'number' ? delay : 0;
    const eas = typeof duration === 'string' ? duration : typeof delay === 'string' ? delay : typeof ease === 'string' ? ease : 'ease';
    const cb = typeof duration === 'function' ? duration : typeof delay === 'function' ? delay : typeof ease === 'function' ? ease : typeof callback === 'function' ? callback : function () {};
    const setTime = del >= 20 ? del - 20 : 0;
    const execTime = setTime + 20;

    let transition = '';

    for (const _ in props) {
      transition += `${_} ${dur}ms ${eas}, `;
      $$(el).css(_, props[_], execTime);
    }

    transition = transition.slice(0, -2);
    $$(el).css({ transition }, setTime);

    setTimeout(cb.bind(el), execTime + dur);

    return el;
  };

  el.off = function (evtName, fn) {
    if (el.length) {
      el.forEach(_el => $$(_el).off(evtName, fn));
      return el;
    }
    
    el.removeEventListener(evtName, fn);
    return el;
  };

  el.on = function (evtName, fn, opts) {
    if (el.length) {
      el.forEach(_el => $$(_el).on(evtName, fn, opts));
      return el;
    }

    switch (evtName) {
      case 'swipeup':
      case 'swiperight':
      case 'swipebottom':
      case 'swipeleft':
        initTouchEvent(el, evtName, fn);
      
      default:
        el.addEventListener(evtName, fn, opts);
    }

    return el;
  };

  el.once = function (evtName, fn) {
    if (el.length) {
      el.forEach(_el => $$(_el).once(evtName, fn));
      return el;
    }
    
    const doThing = (evt) => {
      fn.call(el, evt);
      el.off(evtName, doThing);
    };

    el.on(evtName, doThing);

    return el;
  };

  return el;
};

export default $$;