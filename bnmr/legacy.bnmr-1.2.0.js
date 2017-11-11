// JavaScript Document
($$ = function (selector) {
  var
  sel = selector ? selector : 'body',
  _this = sel.slice(0, 1) == '#' ? document.querySelector(sel) : document.querySelectorAll(sel);
  _this = _this.length == 1 ? _this[0] : _this;

  var
  log = function (msg, style) {
    var
    err = new Error().stack,
    errLines = String(err).split('\n'),
    errLine = errLines[errLines.length - 2],
    logLoc = errLine.match(/\/\/(.*)/).pop(),
    logFile = logLoc.split(':')[0].split('/').pop(),
    logLineNo = logLoc.split(':')[1],
    logLabel = logFile + ' (line ' + logLineNo + '): ',
    logMsg = typeof msg == 'object' ? msg : logLabel + msg,
    logStyle,
    logType;

    switch (style) {
      case null:
      case undefined:
        if (typeof msg == 'object') {
          style = 'dir';
        } else {
          style = 'log';
        }

      case 'assert':      case 'clear':     case 'count':     case 'dir':
      case 'dirxml':      case 'error':     case 'group':     case 'groupCollapsed':
      case 'groupEnd':    case 'info':      case 'log':       case 'profile':
      case 'profileEnd':  case 'table':     case 'time':      case 'timeEnd':
      case 'timeStamp':   case 'trace':     case 'warn':
        logType = 'standard';
      break;

      default:
        logType = 'stylized';
      break;
    }

    switch (logType) {
      case 'standard':
        console[style](logMsg);
      break;

      case 'stylized':
        logStyle = '';

        switch (typeof style) {
          case 'string':
            logStyle = style;
          break;

          case 'object':
            for (var _style in style) {
              logStyle += _style + ': ' + style[_style] + ';';
            }

            logStyle = logStyle.slice(0, logStyle.length - 1);
        }

        console.log('%c%s', logStyle, logMsg);
      break;
    }
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

  loadAsset = function (asset) {
    let
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
        new Image().src = asset;
      break;

      case 'mp4':
      case 'ogv':
      case 'webm':
        var video = document.createElement('video');
        video.src = asset;
        video.load();
      break;
    }
  },

  preload = function (assets) {
    switch (typeof assets) {
      case 'string':
        loadAsset(assets);
      break;

      case 'object':
        for (var i = 0; i < assets.length; i++) {
          loadAsset(asset[i]);
        }
      break;
    }
  },

  rand = function (min, max) {
    return Math.random() * (max - min + 1) + min;
  },

  evalTouch = function (points, evt, fn, e) {
    switch (evt) {
      case 'swipeup':
        if (Math.abs(points.start.y - points.end.y) > 100 &&
          Math.abs(points.start.x - points.end.x) < 20 &&
          points.start.y > points.end.y) {
            fn(e);
        }
      break;

      case 'swiperight':
        if (Math.abs(points.start.x - points.end.x) > 100 &&
          Math.abs(points.start.y - points.end.y) < 20 &&
          points.start.x < points.end.x) {
            fn(e);
        }
      break;

      case 'swipedown':
        if (Math.abs(points.start.y - points.end.y) > 100 &&
          Math.abs(points.start.x - points.end.x) < 20 &&
          points.start.y < points.end.y) {
            fn(e);
        }
      break;

      case 'swipeleft':
        if (Math.abs(points.start.x - points.end.x) > 100 &&
          Math.abs(points.start.y - points.end.y) < 20 &&
          points.start.x > points.end.x) {
            fn(e);
        }
      break;

      case 'tap':
        if (Math.abs(points.start.x - points.end.x) < 20 &&
          Math.abs(points.start.y - points.end.y) < 20) {
            fn(e);
        }
      break;
    }
  },

  setPoints = function (evt, fn) {
    var points = {
      start: {},
      end: {},
      touch: false
    };

    _this.on('touchstart', function (e) {
      points.touch = true;
      points.start.x = e.changedTouches[0].clientX;
      points.start.y = e.changedTouches[0].clientY;
    });

    _this.on('touchend', function (e) {
      points.end.x = e.changedTouches[0].clientX;
      points.end.y = e.changedTouches[0].clientY;
      evalTouch(points, evt, fn,e );
    });

    _this.on('mousedown', function (e) {
      points.start.x = e.clientX;
      points.start.y = e.clientY;
    });

    _this.on('mouseup', function (e) {
      points.end.x = e.clientX;
      points.end.y = e.clientY;
      if (!points.touch) evalTouch(points, evt, fn, e);
    });
  };

  _this.on = function (evt, fn) {
    switch (evt) {
      case 'swipeup':
      case 'swiperight':
      case 'swipedown':
      case 'swipeleft':
      case 'tap':
        setPoints(evt, fn);
      break;

      default:
        if (_this.length) {
          for (var i = 0; i < _this.length; i++) {
            if (window.addEventListener) {
              _this[i].addEventListener(evt, fn);
            } else {
              _this[i].attachEvent('on' + evt, fn);
            }
          }
        } else {
          if (window.addEventListener) {
            _this.addEventListener(evt, fn);
          } else {
            _this.attachEvent('on' + evt, fn);
          }
        }
      break;
    }
  };

  _this.addClass = function (name, delay) {
    setTimeout(function () {
      if (_this.length) {
        for (var i = 0; i < _this.length; i++) {
          _this[i].className += ' ' + name;
        }
      } else {
        _this.className += ' ' + name;
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

    _this.css('transition', transStyles);
    _this.css('webkitTransition', transStyles);

    for (var prop in props) {
      _this.css(prop, props[prop], delay);
    }
  };

  $$.ajax = ajax;
  $$.getParam = getParam;
  $$.log = log;
  $$.preload = preload;
  $$.rand = rand;

  return _this;
})();
