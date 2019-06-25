($$ = (selector = document.body) => {
  let el;
  const fns = {};

  if (selector.nodeName) el = selector;
  else el = document.querySelectorAll(selector).length == 1 ? document.querySelector(selector) : document.querySelectorAll(selector);

  const
  loadAsset = (assets, tracker, callback) => {
    const img = new Image();
    img.src = assets[tracker.curr];

    img.onload = () => {
      ++tracker.curr;
      loadAssetHandler(assets, tracker, callback);
    };
  },

  loadAssetHandler = (assets, tracker, callback) => {
    if (tracker.curr < tracker.total) {
      loadAsset(assets, tracker, callback);
    } else {
      if (callback) callback.call();
    }
  },

  evalTouchEvents = (evt, evtStart, evtEnd, fn) => {
    const
    e = {},
    startX = evtStart.changedTouches ? evtStart.changedTouches[0].clientX : evtStart.layerX,
    endX = evtEnd.changedTouches ? evtEnd.changedTouches[0].clientX : evtEnd.layerX,
    startY = evtStart.changedTouches ? evtStart.changedTouches[0].clientY : evtStart.layerY,
    endY = evtEnd.changedTouches ? evtEnd.changedTouches[0].clientY : evtEnd.layerY;

    for (const prop in evtEnd) e[prop] = evtEnd[prop];
    e.type = evt;

    switch (evt) {
      case 'swipeup':
        if (
          Math.abs(startY - endY) >= 100
          && startY > endY
          && Math.abs(startX - endX) < 20
        ) {
          fn.call(null, e);
        }
      break;

      case 'swiperight':
        if (
          Math.abs(startX - endX) >= 100
          && startX < endX
          && Math.abs(startY - endY) < 20
        ) {
          fn.call(null, e);
        }
      break;

      case 'swipedown':
        if (
          Math.abs(startY - endY) >= 100
          && startY < endY
          && Math.abs(startX - endX) < 20
        ) {
          fn.call(null, e);
        }
      break;

      case 'swipeleft':
        if (
          Math.abs(startX - endX) >= 100
          && startX > endX
          && Math.abs(startY - endY) < 20
        ) {
          fn.call(null, e);
        }
      break;

      case 'tap':
        if (
          Math.abs(startX - endX) < 20
          && Math.abs(startY - endY) < 20
        ) {
          fn.call(null, e);
        }
      break;
    }
  },

  setTouchEvents = (el, evt, fn) => {
    let isTouch;

    try {
      document.createEvent('TouchEvent');
      isTouch = true;
    } catch (e) {
      isTouch = false;
    }

    if (isTouch) {
      el.addEventListener('touchstart', (evtStart) => {
        el.addEventListener('touchend', (evtEnd) => {
          evalTouchEvents(evt, evtStart, evtEnd, fn);
        }, {once: true});
      });
    } else {
      el.addEventListener('mousedown', (evtStart) => {
        el.addEventListener('mouseup', (evtEnd) => {
          evalTouchEvents(evt, evtStart, evtEnd, fn);
        }, {once: true});
      });
    }
  };

  fns.ajax = (options) => {
    const
    type = options.type || 'ajax',
    method = options.method || 'get',
    url = options.url || './',
    isAsync = options.async || true,
    params = options.params,
    headers = options.headers,
    callback = options.callback,
    xhr = new XMLHttpRequest(),
    fd = new FormData();

    let response;

    for (const param in params) {
      fd.append(param, params[param]);
    }

    xhr.onload = () => {
      switch (type) {
        case 'json':
          try { response = JSON.parse(xhr.responseText); }
          catch (e) { console.error(e); response = xhr.responseText; }
        break;

        case 'xml':
          response = xhr.responseXML;
        break;

        default:
          response = xhr.responseText;
        break;
      }

      if (callback) callback.call(null, response);
    }

    xhr.open(method, url, isAsync);
    if (headers) {
      for (const header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
    params ? xhr.send(fd) : xhr.send();
  };

  fns.log = (msg, style) => {
    let label = '';

    try {
      const
      err = new Error(),
      lines = err.stack.split('\n'),
      line = lines[2];

      let
      fnName = line.split('at ')[1],
      fileName = line.split('/').pop();

      fnName = fnName.split(' ')[0];
      fileName = fileName.split(':')[0];

      label = `${fileName} -> ${fnName} -> `;
    } catch (e) {
      label = 'Unknown source -> ';
    }

    if (typeof msg != 'object') {
      if (style in console) {
        console[style](label + msg);
      } else {
        console.log('%c%s', style, label + msg);
      }
    } else {
      if (style in console) {
        console[style](label);
        console.dir(msg)
      } else {
        console.log('%c%s', style, label);
        console.dir(msg);
      }
    }
  };

  fns.getParam = (param) => {
    const
    query = String(window.location).includes('?') ? String(window.location).split('?')[1] : '',
    pairs = query.split('&');

    for (let pair of pairs) {
      if (pair.split('=')[0] == param) {
        return pair.split('=')[1];
      }
    }

    return false;
  };

  fns.ls = (type, property, value) => {
    if ('localStorage' in window) {
      switch (type) {
        case 'set':
          localStorage.setItem(property, value);
          return fns.ls('get', property);
        break;

        case 'get':
          return localStorage.getItem(property);
        break;

        case 'clear':
          localStorage.clear();
          return true;
        break;
      }
    } else {
      return false;
    }
  };

  fns.preload = (assets, callback) => {
    const tracker = {
      curr: 0,
      total: 0
    };

    if (typeof assets == 'string') assets = [assets];

    tracker.total = assets.length;

    loadAssetHandler(assets, tracker, callback);
  };

  fns.rand = (min, max, isFloat) => {
    if (typeof min == 'object') {
      const arr = min;
      let result = [];

      while (result.length < arr.length) {
        let newValue = Math.floor(Math.random() * arr.length);

        while (result.indexOf(arr[newValue]) > -1) {
          newValue = Math.floor(Math.random() * arr.length);
        }

        result.push(arr[newValue]);
      }

      return result;
    } else {
      return isFloat ? Math.round(Math.random() * (max -min + 1) + min) : (Math.random() * (max -min + 1) + min);
    }
  };

  for (var fn in fns) {
    $$[fn] = fns[fn];
  }

  el.on = (evt, fn) => {
    if (el.length) {
      for (let element of el) {
        $$(element).on(evt, fn);
      }
    } else {
      switch (evt) {
        case 'swipeup':
        case 'swiperight':
        case 'swipedown':
        case 'swipeleft':
        case 'tap':
          setTouchEvents(el, evt, fn);
        break;

        default:
          el.addEventListener(evt, fn);
        break;
      }
    }

    return el;
  };

  el.css = (property, value, delay, callback) => {
    if (el.length) {
      for (const element of el) {
        $$(element).css(property, value, delay, callback);
      }
    } else {
      setTimeout(() => {
        el.style[property] = value;

        if (callback) callback.call();
      }, delay || 0);
    }

    return el;
  };

  el.animate = (properties, duration, delay, ease, callback) => {
    if (el.length) {
      for (const element of el) {
        $$(element).animate(properties, duration, delay, ease, callback);
      }
    } else {
      let transStyles = '';

      for (const prop in properties) {
        transStyles += `${prop} ${duration || 500}ms ${ease || 'ease'}, `;
      }
      transStyles = transStyles.slice(0, -2);

      $$(el).css('transition', transStyles, delay ? (delay >= 20 ? delay - 20 : delay) : 0);

      for (const prop in properties) {
        $$(el).css(prop, properties[prop], delay ? (delay >= 20 ? delay - 20 : delay) : 0);
      }

      if (callback) setTimeout(callback, delay || 0);
    }

    return el;
  };

  el.raf = (options) => {
    if (el.length) {
      for (const element of el) {
        $$(element).raf(options);
      }
    } else {
      if (!options.property || !options.end) throw "Please provide a property and end point.";

      const
      property = options.property,
      start = options.start || el.getBoundingClientRect()[property],
      end = options.end,
      speed = options.speed || start < end ? 1 : -1
      direction = start < end ? 1 : 0,
      condition = direction ? start + speed < end : start + speed > end;

      if (condition) {
        let newVal = start + speed;
        $$(el).css(property, `${newVal}px`);
        options.start = newVal;
        requestAnimationFrame(el.raf.bind(null, options));
      } else {
        if (options.callback) options.callback.call();
      }
    }

    return el;
  };

  return el;
})();
