($$ = function (selector) {
  var el;

  if (!selector) selector = 'body';

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

  var
  ajax = function (options) {
    if (!options) options = {};
    var
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

    var data;

    for (var param in params) {
      fd.append(param, params[param]);
    }

    xhr.onload = function () {
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

    xhr.onerror = function () {
      if (error) error.call();
    };

    xhr.open(method, url, isAsync);
    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
    params ? xhr.send(fd) : xhr.send();
  },

  getParam = function (param) {
    var
    query = location.search.slice(1),
    pairs = query.split('&')
    key,
    value;

    for (var pair in pairs) {
      key = pair.split('=')[0];
      if (key == param) {
        value = pair.split('=')[1];
        return value;
      }
    }

    return false;
  },

  log = function (msg, style) {
    var label = '';

    try {
      var err = new Error();
      label = err.stack.split('\n')[2].split('/').pop().slice(0, -1);
    } catch (e) {
      label = 'Unknown source';
    }

    if (style) {
      if (style in console) {
        console.log(`${label} ->`);
        console[style](msg);
      } else {
        console.log('%c%s', style, `${label} -> ${msg}`);
      }
    } else {
      console.log(`${label} -> ${msg}`);
    }
  },

  loadAsset = function (assets, tracker, callback) {
    var asset = assets[tracker.current];

    ajax({
      url: asset,
      callback: function () {
        ++tracker.current;
        prepareAssets(assets, tracker, callback);
      },
      error: function () {
        $$.log(`Could not preload file: ${asset}`, 'error');
        ++tracker.current;
        prepareAssets(assets, tracker, callback);
      }
    });
  },

  prepareAssets = function (assets, tracker, callback) {
    if (tracker.current < tracker.total) {
      loadAsset(assets, tracker, callback);
    } else {
      if (callback) callback.call();
    }
  },

  preload = function (assets, callback) {
    var tracker = {
      current: 0,
      total: 0
    };

    if (typeof assets == 'string') assets = [assets];

    tracker.total = assets.length;

    prepareAssets(assets, tracker, callback);
  },

  rand = function (min, max, isFloat) {
    var result;

    if (typeof min == 'object' && typeof min != null) {
      var
      arr = min,
      safety = Math.pow(arr.length, 2);

      result = [];

      while (result.length < arr.length) {
        var newIndex = Math.floor(Math.random() * arr.length);
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

  evaluateTouchEvents = function (el, startEvt, endEvt, evt, fn) {
    var
    startX = startEvt.changedTouches ? startEvt.changedTouches[0].clientX : startEvt.clientX,
    startY = endEvt.changedTouches ? startEvt.changedTouches[0].clientY : startEvt.clientY,
    endX = endEvt.changedTouches ? endEvt.changedTouches[0].clientX : endEvt.clientX,
    endY = endEvt.changedTouches ? endEvt.changedTouches[0].clientY : endEvt.clientY,
    evtObj = {};

    for (var prop in endEvt) {
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

  initiateTouchEvents = function (el, evt, fn) {
    el.addEventListener('mousedown', function (downEvt) {
      el.addEventListener('mouseup', function (upEvt) {
        evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
      }, {once: true});
    });

    el.addEventListener('touchstart', function (downEvt) {
      el.addEventListener('touchend', function (upEvt) {
        evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
      }, {once: true});
    });
  },

  ls = function (type, key, value) {
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

  el.addClass = function (cName, delay) {
	  setTimeout(function () {
	  	if (el.length) {
        for (var i = 0; i < el.length; i++) {
		  		el[i].classList.add(cName);
	  		}
	  	} else {
	  		el.classList.add(cName);
	  	}

      return el;
  	}, delay || 0);
  };

  el.removeClass = function (cName, delay) {
	  setTimeout(function () {
	  	if (el.length) {
        for (var i = 0; i < el.length; i++) {
		  		el[i].classList.remove(cName);
	  		}
	  	} else {
	  		el.classList.remove(cName);
	  	}

      return el;
  	}, delay || 0);
  };

  el.replaceClass = function (cName, cName2, delay) {
	  setTimeout(function () {
	  	if (el.length) {
        for (var i = 0; i < el.length; i++) {
		  		el[i].className = item.className.replace(cName, cName2);
	  		}
	  	} else {
	  		el.className = el.className.replace(cName, cName2);
	  	}

      return el;
  	}, delay || 0);
  };

  el.css = function (prop, value, delay, callback) {
    if (el.length) {
      for (var i = 0; i < el.length; i++) {
        $$(el[i]).css(prop, value, delay, callback);
      }
    } else {
      setTimeout(function () {
        el.style[prop] = value;
      }, delay || 0);
    }

    if (callback) setTimeout(callback, delay);

    return el;
  };

  el.animate = function (props, duration, delay, ease, callback) {
    var
    transitions = '',
    duration = duration || 500,
    delay = delay || 0,
    ease = ease || 'ease';

    if (el.length) {
      for (var i = 0; i < el.length; i++) {
        $$(el[i]).animate(props, duration, delay, ease, callback);
      }
    } else {
      for (var prop in props) {
        transitions += `${prop} ${duration}ms ${ease}, `;
      }
      transitions = transitions.slice(0, -2);

      el.css('transition', transitions, (delay >= 20) ? delay - 20 : delay);

      for (var prop in props) {
        el.css(prop, props[prop], delay);
      }
    }

    if (callback) setTimeout(callback, duration + delay);

    return el;
  };

  el.raf = function (options) {
    if (!options) options = {};

    if (el.length) {
      for (var i = 0; i < el.length; i++) {
        $$(el[i]).raf(options);
      }
    } else {
      var
      property = options.property,
      destination = options.destination;

      var
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

  el.on = function (evt, fn) {
    switch (evt) {
      case 'swipeup':
      case 'swiperight':
      case 'swipedown':
      case 'swipeleft':
      case 'tap':
        if (el.length) {
          for (var i = 0; i < el.length; i++) {
            initiateTouchEvents(el[i], evt, fn);
          }
        } else {
          initiateTouchEvents(el, evt, fn);
        }
      break;

      default:
        el.addEventListener(evt, fn);
      break;
    }

    return el;
  };

  $$.ajax = ajax;
  $$.getParam = getParam;
  $$.log = log;
  $$.ls = ls;
  $$.preload = preload;
  $$.rand = rand;

  return el;
})();
