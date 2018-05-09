// JavaScript Document
($$ = function (selector) {
  var
  sel = selector || 'body',
  _this = sel.slice(0, 1) == '#' || document.querySelectorAll(sel).length == 1 ? document.querySelector(sel) : document.querySelectorAll(sel);

  log = function (msg, type) {
    var
    typ = type || 'log',
    stylized = null,
    style = null,
    label = '';

    try {
      var
      err = new Error(),
      stack = err.stack,
      lines = stack.split('\n'),
      line,
      fileName,
      lineNo,
      charNo;

      for (var i = 0; i < lines.length; i++) {
        if (lines[i] == '') {
          lines.splice(i, 1);
        }
      }

      line = lines[lines.length - 1].indexOf('setTouchPoints') > -1 ? lines[lines.length - 3] : lines[lines.length - 1]
      fileName = line.split('/')[line.split('/').length - 1].split(':')[0];
      lineNo = line.split(':')[line.split(':').length - 2];
      charNo = line.split(':')[line.split(':').length - 1];

      label = typeof msg == 'object' ? fileName + ':' + lineNo + ':' + charNo + ' -> Object' : fileName + ':' + lineNo + ':' + charNo + ' -> ';
    } catch (e) {
      msg = msg
    }

    switch (typ) {
      case 'assert':      case 'clear':   case 'count':   case 'dir':
      case 'dirxml':      case 'error':   case 'group':   case 'groupCollapsed':
      case 'groupEnd':    case 'info':    case 'log':     case 'profile':
      case 'profileEnd':  case 'table':   case 'time':    case 'timeEnd':
      case 'timeStamp':   case 'trace':   case 'warn':
        stylized = false;
      break;

      default:
        stylized = true;
      break;
    }

    if (stylized) {
      if (typeof typ == 'object') {
        style = '';
        for (var prop in typ) {
          style += prop + ': ' + typ[prop] + ';';
        }
      } else {
        style = typ;
      }

      if (typeof msg == 'object') {
        console.log('%c%s', style, label);
        console.dir(msg);
      } else {
        console.log('%c%s', style, label + msg);
      }
    } else {
      if (typeof msg == 'object') {
        console[typ](label);
        console.dir(msg);
      } else {
        console[typ](label + msg);
      }
    }
  },

  exists = function (value) {
    if (value) {
      if (value !== null &&
          value !== undefined &&
          value !== 'null' &&
          value !== 'undefined' &&
          value !== '') {
            return true;
      }
    }

    return false;
  },

  ajax = function (options, callback) {
    var
    type = options.type || 'ajax',
    method = options.method || 'GET',
    url = options.url || './',
    isAsync = options.async || true,
    params = options.params || null,
    progress = options.progress || null,
    xhr = new XMLHttpRequest(),
    data;

    progress ? xhr.upload.onprogress = progress : null;

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        switch (type) {
          case 'xml':
            data = xhr.responseXML;
          break;

          case 'json':
            data = JSON.parse(xhr.responseText);
          break;

          default:
            data = xhr.responseText;
          break;
        }

        if (callback) {
          callback(data);
        }

        return data;
      }
    }

    xhr.open(method, url, isAsync);
    params ? xhr.send(params) : xhr.send();
  },

  getParam = function (param) {
    var
    loc = String(window.location),
    query = loc.indexOf('?') > -1 ? loc.split('?')[1] : null,
    pairs = query ? query.split('&') : null,
    key,
    value;

    if (pairs) {
      for (var i = 0; i < pairs.length; i++) {
        key = pairs[i].split('=')[0];
        if (key == param) {
          value = pairs[i].split('=')[1];
          return value;
        }
      }
    }

    return false;
  },

  loadAsset = function (asset, callback, numAssets, numLoaded) {
    var
    file,
    fileNameBits = asset.split('.'),
    ext = fileNameBits.pop().toLowerCase();

    switch (ext) {
      case 'bmp':
      case 'gif':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'tiff':
      case 'webp':
        file = new Image();
        file.src = asset;
      break;

      case 'mp4':
      case 'ogv':
      case 'webm':
        file = document.createElement('video');
        file.src = asset;
        file.load();
      break;
    }

    file.onload = function () {
      if (numLoaded == numAssets && exists(callback)) {
        callback.call();
      }
    };
  },

  preload = function (assets, callback) {
    var cb = callback || null;

    switch (typeof assets) {
      case 'string':
        loadAsset(assets, cb, 1, 1);
      break;

      case 'object':
        for (var i = 0; i < assets.length; i++) {
          loadAsset(assets[i], cb, (i + 1), assets.length);
        }
      break;
    }
  },

  rand = function (min, max, float) {
    if (typeof min == 'object') {
      var
      array = min,
      results = [];

      for (var i = 0; i < array.length; i++) {
        var newIndex = Math.floor(Math.random() * array.length);
        while (results.indexOf(array[newIndex]) > -1) {
          newIndex = Math.floor(Math.random() * array.length);
        }
        results.push(array[newIndex]);
      }

      return results;
    } else {
      if (float) {
        return Math.random() * (max - min + 1) + min;
      } else {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
    }
  },

  listener = function (evt, fn) {
    if (addEventListener) {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].addEventListener(evt, fn);
        }
      } else {
        _this.addEventListener(evt, fn);
      }
    } else {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].attachEvent('on' + evt, fn);
        }
      } else {
        _this.attachEvent('on' + evt, fn);
      }
    }
  },

  evalTouchPoints = function (points, evt, fn, e) {
    var evtObj = {};
    for (var key in e) {
      evtObj[key] = key == 'type' ? evt : e[key];
    }

    switch (evt) {
      case 'swipeup':
        if (Math.abs(points.start.y - points.end.y) >50 && Math.abs(points.start.x - points.end.x) < 20 && points.start.y > points.end.y) {
          fn(evtObj);
        }
      break;

      case 'swiperight':
        if (Math.abs(points.start.x - points.end.x) > 50 && Math.abs(points.start.y - points.end.y) < 20 && points.start.x < points.end.x) {
          fn(evtObj);
        }
      break;

      case 'swipedown':
        if (Math.abs(points.start.y - points.end.y) > 50 && Math.abs(points.start.x - points.end.x) < 20 && points.start.y < points.end.y) {
          fn(evtObj);
        }
      break;

      case 'swipeleft':
        if (Math.abs(points.start.x - points.end.x) > 50 && Math.abs(points.start.y - points.end.y) < 20 && points.start.x > points.end.x) {
          fn(evtObj);
        }
      break;

      case 'tap':
        if (Math.abs(points.start.x - points.end.x) < 10 && Math.abs(points.start.y - points.end.y) < 10) {
          fn(evtObj);
        }
      break;
    }
  },

  setTouchPoints = function (evt, fn) {
    var points = {};

    points.start = {};
    points.end = {};
    points.touch = false;

    listener('touchstart', function (e) {
      points.start.x = e.changedTouches[0].clientX;
      points.start.y = e.changedTouches[0].clientY;
      points.touch = true;
    })

    listener('touchend', function (e) {
      points.end.x = e.changedTouches[0].clientX;
      points.end.y = e.changedTouches[0].clientY;
      evalTouchPoints(points, evt, fn, e);
    });

    listener('mousedown', function (e) {
      points.start.x = e.clientX;
      points.start.y = e.clientY;
    })

    listener('mouseup', function (e) {
      points.end.x = e.clientX;
      points.end.y = e.clientY;
      if (!points.touch) evalTouchPoints(points, evt, fn, e);
    });
  };

  _this.on = function (evt, fn) {
    switch (evt) {
      case 'swipeup':
      case 'swiperight':
      case 'swipedown':
      case 'swipeleft':
      case 'tap':
        setTouchPoints(evt, fn);
      break;

      default:
        listener(evt, fn);
      break;
    }
  };

  _this.addClass = function (name, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          if (_this[i].className.indexOf(name) == -1) {
            _this[i].className += ' ' + name;
          }
        }
      } else {
        if (_this.className.indexOf(name) == -1) {
          _this.className += ' ' + name;
        }
      }
    }, delay || 0);
  };

  _this.removeClass = function (name, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].className = _this[i].className.replace(name, '');
        }
      } else {
        _this.className = _this.className.replace(name, '');
      }
    }, delay || 0);
  };

  _this.replaceClass = function (oldName, newName, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].className = _this[i].className.replace(oldName, newName);
        }
      } else {
        _this.className = _this.className.replace(oldName, newName);
      }
    }, delay || 0);
  };

  _this.toggleClass = function (name, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          if (_this[i].className.indexOf(name) == -1) {
            _this[i].addClass(name);
          } else {
            _this[i].removeClass(name);
          }
        }
      } else {
        if (_this.className.indexOf(name) == -1) {
          _this.addClass(name);
        } else {
          _this.removeClass(name);
        }
      }
    }, delay || 0);
  };

  _this.css = function (property, value, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].style[property] = value;
        }
      } else {
        _this.style[property] = value;
      }
    }, delay || 0);
  };

  _this.animate = function (properties, duration, delay, ease) {
    var
    props = properties || null,
    dur = duration || 500,
    del = delay || 0,
    eas = ease || 'ease',
    transStyles = '';

    for (var prop in props) {
      transStyles += prop + ' ' + dur + 'ms ' + eas + ',';
    }

    transStyles = transStyles.slice(0, transStyles.length - 1);

    _this.css('transition', transStyles, (del >= 20 ? del - 20 : 0));
    _this.css('-webkit-transition', transStyles, (del >= 20 ? del - 20 : 0));

    for (var prop in props) {
      _this.css(prop, props[prop], delay);
    }
  };

  $$.ajax = ajax;
  $$.exists = exists;
  $$.getParam = getParam;
  $$.log = log;
  $$.preload = preload;
  $$.rand = rand;

  return _this;
})();
