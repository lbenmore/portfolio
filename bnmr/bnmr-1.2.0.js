// JavaScript Document
($$ = (selector) => {
  let
  sel = selector ? selector : 'body',
  _this = sel.slice(0, 1) == '#' ? document.querySelector(sel) : document.querySelectorAll(sel);
  _this = _this.length == 1 ? _this[0] : _this,

  numAssets = 0,
  currAsset = 0;

  const
  exists = (value) => {
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

  log = (msg, style) => {
    let
    err = new Error().stack,
    errLines = String(err).split('\n'),
    errLine,
    logLoc,
    logFile,
    logLineNo,
    logLabel,
    logMsg,
    logStyle,
    logType;

    for (let line of errLines) {
      if (!exists(line)) errLines.splice(errLines.indexOf(line), 1);
    }

    errLine = errLines[errLines.length - 1].includes('setPoints') ? errLines[errLines.length - 3] : errLines[errLines.length - 1],
    logLoc = errLine.match(/\/\/(.*)/).pop(),
    logFile = logLoc.split(':')[logLoc.split(':').length - 3].split('/').pop(),
    logLineNo = logLoc.split(':')[logLoc.split(':').length - 2],
    logLabel = `${logFile} (line ${logLineNo}): `,
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
            for (let _style in style) {
              logStyle += `${_style}: ${style[_style]};`;
            }

            logStyle = logStyle.slice(0, logStyle.length - 1);
        }

        console.log('%c%s', logStyle, logMsg);
      break;
    }
  },

  ajax = (options, callback) => {
    let
    type = options.type || 'ajax',
    method = options.method || 'GET',
    url = options.url || './',
    isAsync = options.async || true,
    params = options.params || null,
    progress = options.progress || null,
    xhr = new XMLHttpRequest(),
    data;

    progress ? xhr.upload.onprogress = progress : null;

    xhr.onreadystatechange = () => {
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

  getParam = (param) => {
    let
    loc = String(window.location),
    query = loc.indexOf('?') > -1 ? loc.split('?')[1] : null,
    pairs = query ? query.split('&') : null,
    key,
    value;

    if (pairs) {
      for (let pair of pairs) {
        key = pair.split('=')[0];
        if (key == param) {
          value = pair.split('=')[1];
          return value;
        }
      }
    }

    return false;
  },

  loadAsset = (asset, callback, numAssets, numLoaded) => {
    let
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

    file.onload = () => {
      if (numLoaded == numAssets && exists(callback)) {
        callback.call();
      }
    }
  },

  preload = (assets, callback) => {
    let cb = callback || null;

    switch (typeof assets) {
      case 'string':
        loadAsset(assets, cb, 1, 1);
      break;

      case 'object':
        let i = 0;
        for (let asset of assets) {
          ++i;
          loadAsset(asset, cb, i, assets.length);
        }
      break;
    }
  },

  rand = (min, max, float) => {
    if (typeof min == 'object') {
      let
      array = min,
      results = [];

      for (let i = 0; i < array.length; i++) {
        let newIndex = Math.floor(Math.random() * array.length);
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

  evalTouch = (points, evt, fn, e) => {
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

  setPoints = (evt, fn) => {
    let points = {
      start: {},
      end: {},
      touch: false
    };

    _this.on('touchstart', (e) => {
      points.touch = true;
      points.start.x = e.changedTouches[0].clientX;
      points.start.y = e.changedTouches[0].clientY;
    });

    _this.on('touchend', (e) => {
      points.end.x = e.changedTouches[0].clientX;
      points.end.y = e.changedTouches[0].clientY;
      evalTouch(points, evt, fn,e );
    });

    _this.on('mousedown', (e) => {
      points.start.x = e.clientX;
      points.start.y = e.clientY;
    });

    _this.on('mouseup', (e) => {
      points.end.x = e.clientX;
      points.end.y = e.clientY;
      if (!points.touch) evalTouch(points, evt, fn, e);
    });
  };

  _this.on = (evt, fn) => {
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
          for (let __this of _this) {
            if (window.addEventListener) {
              __this.addEventListener(evt, fn);
            } else {
              __this.attachEvent(`on${evt}`, fn);
            }
          }
        } else {
          if (window.addEventListener) {
            _this.addEventListener(evt, fn);
          } else {
            _this.attachEvent(`on${evt}`, fn);
          }
        }
      break;
    }
  };

  _this.addClass = (name, delay) => {
    setTimeout(() => {
      if (document.classList) {
        if (_this.length) {
          for (let __this of _this) {
            __this.classList.add(name);
          }
        } else {
          _this.classList.add(name);
        }
      } else {
        if (_this.length) {
          for (let __this of _this) {
            if (__this.className.indexOf(name) == -1) {
              __this.className += ` ${name}`;
            }
          }
        } else {
          if (_this.className.indexOf(name) == -1) {
            _this.className += ` ${name}`;
          }
        }
      }
    }, delay || 0);
  };

  _this.removeClass = (name, delay) => {
    setTimeout(() => {
      if (document.classList) {
        if (_this.length) {
          for (let __this of _this) {
            __this.classList.remove(name);
          }
        } else {
          _this.classList.remove(name);
        }
      } else {
        if (_this.length) {
          for (let __this of _this) {
            __this.className = __this.className.replace(name, '');
          }
        } else {
          _this.className = _this.className.replace(name, '');
        }
      }
    }, delay || 0);
  };

  _this.replaceClass = (oldName, newName, delay) => {
    setTimeout(() => {
      if (_this.length) {
        for (let __this of _this) {
          __this.className = __this.className.replace(oldName, newName);
        }
      } else {
        _this.className = _this.className.replace(oldName, newName);
      }
    }, delay || 0);
  };

  _this.toggleClass = (name, delay) => {
    setTimeout(() => {
      if (_this.length) {
        for (let __this of _this) {
          if (__this.className.indexOf(name) == -1) {
            __this.addClass(name);
          } else {
            __this.removeClass(name);
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

  _this.css = (property, value, delay) => {
    setTimeout(() => {
      if (_this.length) {
        for (let __this of _this) {
          __this.style[property] = value;
        }
      } else {
        _this.style[property] = value;
      }
    }, delay || 0);
  };

  _this.animate = (properties, duration, delay, ease) => {
    let
    props = properties || null,
    dur = duration || 500,
    del = delay || 0,
    eas = ease || 'ease',
    transStyles = '';

    for (let prop in props) {
      transStyles += `${prop} ${dur}ms ${eas},`;
    }

    transStyles = transStyles.slice(0, transStyles.length - 1);

    _this.css('transition', transStyles, (del >= 20 ? del - 20 : 0));
    _this.css('-webkit-transition', transStyles, (del >= 20 ? del - 20 : 0));

    for (let prop in props) {
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
