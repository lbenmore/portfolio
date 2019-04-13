($$ = function (selector = 'body') {
  let el;

  if (typeof selector == 'string') {
    el = (document.querySelectorAll(selector).length == 1)
      ? document.querySelector(selector)
      : document.querySelectorAll(selector);
  } else if (selector.nodeName){
    el = selector;
  } else {
    $$.log('Please pass valid selector or node', 'error');
    return;
  }

  const
  ajax = (options = {}) => {
    const
    type = options.type || 'ajax',
    method = options.method || 'GET',
    url = options.url || './',
    isAsync = options.async || true,
    headers = options.headers || null,
    params = options.params || null,
    callback = options.callback || null,
    error = options.error || null,
    xhr = new XMLHttpRequest(),
    fd = new FormData();

    let data;

    for (const param in params) {
      fd.append(param, params[param]);
    }

    xhr.onload = () => {
      switch (type) {
        case 'json':
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            $$.log(e, 'error');
            data = xhr.responseText;
          }
        break;

        case 'xml':
          data = xhr.responseXML;
        break;

        default:
          data = xhr.responseText;
        break;
      }

      if (callback) callback.call(null, data);
    };

    xhr.onerror = () => {
      if (error) error.call();
    };

    xhr.open(method, url, isAsync);
    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
    params ? xhr.send(fd) : xhr.send();
  },

  getParam = (param) => {
    const
    query = location.search.slice(1),
    pairs = query.split('&');

    let
    key,
    value;

    for (let pair in pairs) {
      key = pair.split('=')[0];
      if (key == param) {
        value = pair.split('=')[1];
        return value;
      }
    }

    return false;
  },

  log = (msg, style) => {
    if (style) {
      if (style in console) {
        console[style](msg);
      } else {
        console.log('%c%s', style, msg);
      }
    } else {
      console.log(msg);
    }
  },

  loadAsset = (assets, tracker, callback) => {
    const asset = assets[tracker.current];

    ajax({
      url: asset,
      callback: () => {
        ++tracker.current;
        prepareAssets(assets, tracker, callback);
      },
      error: () => {
        $$.log(`Could not preload file: ${asset}`, 'error');
        ++tracker.current;
        prepareAssets(assets, tracker, callback);
      }
    });
  },

  prepareAssets = (assets, tracker, callback) => {
    if (tracker.current < tracker.total) {
      loadAsset(assets, tracker, callback);
    } else {
      if (callback) callback.call();
    }
  },

  preload = (assets, callback) => {
    const tracker = {
      current: 0,
      total: 0
    };

    if (typeof assets == 'string') assets = [assets];

    tracker.total = assets.length;

    prepareAssets(assets, tracker, callback);
  },

  rand = (min, max, isFloat) => {
    let result;

    if (typeof min == 'object' && typeof min != null) {
      let arr = min;
      result = [];

      while (result.length < arr.length) {
        let newIndex = Math.floor(Math.random() * arr.length);
        --safety;
        while (result.indexOf(arr[newIndex]) > -1) {
          newIndex = Math.floor(Math.random() * arr.length);
          --safety;
        }
        result.push(arr[newIndex]);
      }

      return result;
    } else {
      result = Math.random() * (max - min + 1) + min;
      return isFloat ? result : Math.floor(result);
    }
  },

  evaluateTouchEvents = (el, startEvt, endEvt, evt, fn) => {
    const
    startX = startEvt.changedTouches ? startEvt.changedTouches[0].clientX : startEvt.clientX,
    startY = endEvt.changedTouches ? startEvt.changedTouches[0].clientY : startEvt.clientY,
    endX = endEvt.changedTouches ? endEvt.changedTouches[0].clientX : endEvt.clientX,
    endY = endEvt.changedTouches ? endEvt.changedTouches[0].clientY : endEvt.clientY,
    evtObj = {};

    for (const prop in endEvt) {
      evtObj[prop] = endEvt[prop];
    }
    evtObj.originalEvent = startEvt;
    evtObj.type = evt;

    switch (evt) {
      case 'swipeup':
        if (
          (Math.abs(startY - endY) > 100) &&
          (startY > endY) &&
          (Math.abs(startX - endX) < 20)
        ) {
          fn(evtObj);
        }
      break;

      case 'swiperight':
        if (
          (Math.abs(startX - endX) > 100) &&
          (startX < endX) &&
          (Math.abs(startY - endY) < 20)
        ) {
          fn(evtObj);
        }
      break;

      case 'swipedown':
        if (
          (Math.abs(startY - endY) > 100) &&
          (startY < endY) &&
          (Math.abs(startX - endX) < 20)
        ) {
          fn(evtObj);
        }
      break;

      case 'swipeleft':
        if (
          (Math.abs(startX - endX) > 100) &&
          (startX > endX) &&
          (Math.abs(startY - endY) < 20)
        ) {
          fn(evtObj);
        }
      break;

      case 'tap':
        if (
          (Math.abs(startX - endX) < 10) &&
          (Math.abs(startY - endY) < 10)
        ) {
          fn(evtObj);
        }
      break;
    }
  },

  initiateTouchEvents = (el, evt, fn) => {
    el.addEventListener('mousedown', (downEvt) => {
      el.addEventListener('mouseup', (upEvt) => {
        evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
      }, {once: true});
    });

    el.addEventListener('touchstart', (downEvt) => {
      el.addEventListener('touchend', (upEvt) => {
        evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
      }, {once: true});
    });
  },

  ls = (type, key, value) => {
    switch (type) {
      case 'get':
        return localStorage.getItem(key);
      break;

      case 'set':
        localStorage.setItem(key, value);
        ls('get', key);
      break;

      case 'clear':
        localStorage.clear();
        return true;
      break;
    }
  };

  el.css = (prop, value, delay, callback) => {
    if (el.length) {
      for (const item of el) {
        $$(item).css(prop, value, delay, callback);
      }
    } else {
      setTimeout(() => {
        el.style[prop] = value;
      }, delay || 0);
    }

    if (callback) setTimeout(callback, delay);

    return el;
  };

  el.animate = (props, duration = 500, delay = 0, ease = 'ease', callback) => {
    let transitions = '';

    if (el.length) {
      for (const item of el) {
        $$(item).animate(props, duration, delay, ease, callback);
      }
    } else {
      for (const prop in props) {
        transitions += `${prop} ${duration}ms ${ease}, `;
      }
      transitions = transitions.slice(0, -2);

      el.css('transition', transitions, (delay >= 20) ? delay - 20 : delay);

      for (const prop in props) {
        el.css(prop, props[prop], delay);
      }
    }

    if (callback) setTimeout(callback, duration + delay);

    return el;
  };

  el.raf = (options = {}) => {
    if (el.length) {
      for (const item of el) {
        $$(item).raf(options);
      }
    } else {
      const
      property = options.property,
      destination = options.destination;

      let
      start = options.start || el.getBoundingClientRect()[property],
      direction = options.direction || start < destination ? 1 : -1,
      condition = direction == 1 ? start < destination : start > destination,
      speed = options.speed || 1,
      newValue;

      if (condition) {
        newValue = `${start + (speed * direction)}px`;
        options.start = parseInt(newValue);
        options.direction = direction;
        el.style[property] = newValue;
        requestAnimationFrame(el.raf.bind(null, options));
      } else {
        if (options.callback) options.callback.call();
      }

      if (!property || !destination) {
        $$.log('Please provide a property and destination', 'error');
      }
    }

    return el;
  };

  el.on = (evt, fn) => {
    switch (evt) {
      case 'swipeup':
      case 'swiperight':
      case 'swipedown':
      case 'swipeleft':
      case 'tap':
        if (el.length) {
          for (const item of el) {
            initiateTouchEvents(item, evt, fn);
          }
        } else {
          initiateTouchEvents(el, evt, fn);
        }
      break;

      default:
        el.addEventListener(evt, fn);
      break;
    }
  };

  $$.ajax = ajax;
  $$.getParam = getParam;
  $$.log = log;
  $$.ls = ls;
  $$.preload = preload;
  $$.rand = rand;

  return el;
})();
