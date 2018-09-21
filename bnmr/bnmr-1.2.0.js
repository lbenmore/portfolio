// JavaScript Document
($$ = (selector) => {
	let
	el = selector || 'body',
	_this = el.slice(0, 1) == '#' || document.querySelectorAll(el).length == 1 ? document.querySelector(el) : document.querySelectorAll(el);

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

  log = (msg, type) => {
    let
    typ = type || 'log',
    stylized = null,
    style = null,
    label = '';

    try {
      let
      err = new Error(),
      stack = err.stack,
      lines = stack.split('\n'),
      line,
      fileName,
      lineNo,
      charNo;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i] == '') {
          lines.splice(i, 1);
        }
      }

      line = lines[lines.length - 1].indexOf('setTouchPoints') > -1 ? lines[lines.length - 3] : lines[lines.length - 1]
      fileName = line.split('/')[line.split('/').length - 1].split(':')[0];
      lineNo = line.split(':')[line.split(':').length - 2];
      charNo = line.split(':')[line.split(':').length - 1];

      label = typeof msg == 'object' ? `${fileName}:${lineNo}:${charNo} -> Object` : `${fileName}:${lineNo}:${charNo} -> `;
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
          style += `${prop}: ${typ[prop]};`;
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

	scrollPosition = (axis) => {
		const doc = document.documentElement;
		return axis == 'left' ?
			(pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0) :
			(pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	},

  loadAsset = (asset, callback, evt) => {
    let
    file,
    fileNameBits = asset.split('.'),
    ext = fileNameBits.pop().toLowerCase();

    switch (ext) {
      case 'mp4':
      case 'ogv':
      case 'webm':
        file = document.createElement('video');
        file.src = asset;
        file.load();
      break;

			default:
        file = new Image();
        file.src = asset;
			break;
    }

    file.onload = () => {
			dispatchEvent(evt);
    };

		file.onerror = (e) => {
			console.error(`Error loading file: ${asset}`);
			console.dir(e);
			dispatchEvent(evt);
		};
  },

  preload = (assets, callback) => {
    let
		cb = callback || null,
		loadEvent = new Event('bnmr_preload_event'),
		numAssets,
		loaded = 0;

    switch (typeof assets) {
      case 'string':
				numAssets = 1;
        loadAsset(assets, cb, loadEvent);
      break;

      case 'object':
				numAssets = assets.length;

        for (let asset of assets) {
          loadAsset(asset, cb, loadEvent);
        }
      break;
    }

		if (callback) {
			addEventListener('bnmr_preload_event', () => {
				++loaded;
				if (loaded == numAssets) callback.call(null);
			});
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

  listener = (evt, fn) => {
    if (addEventListener) {
      if (_this.length) {
        for (let __this of _this) {
          __this.addEventListener(evt, fn);
        }
      } else {
        _this.addEventListener(evt, fn);
      }
    } else {
      if (_this.length) {
        for (let __this of _this) {
          __this.attachEvent('on' + evt, fn);
        }
      } else {
        _this.attachEvent('on' + evt, fn);
      }
    }
  },

  evalTouchPoints = (points, evt, fn, e) => {
    let evtObj = {};

    for (let key in e) {
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

  setTouchPoints = (evt, fn) => {
    let points = {};

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

  _this.on = (evt, fn) => {
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

	_this.distanceFrom = (direction, element = _this, value = 0) => {
		const newVal = direction == 'left' ?
				value + element.offsetLeft :
				value + element.offsetTop;
		console.log(element);
		console.log(value);
		if (element.parentNode) {
			return _this.distanceFrom(direction, element.parentNode, newVal);
		} else {
			return value;
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

	_this.raf = (options) => {
		let objAnim = {}, condition, newValue;

		if (!options.property || !options.destination) throw 'Please pass an object parameter with all required properties.';

		objAnim.property = options.property;
		objAnim.direction = options.direction || 'positive';
		objAnim.start = options.start || 0;
		objAnim.destination = options.destination;
		objAnim.speed = options.speed || 1;
		objAnim.delay = options.delay || 0;
		objAnim.callback = options.callback || null;

		condition = objAnim.direction == 'negative' ?
				objAnim.start > objAnim.destination :
				objAnim.start < objAnim.destination;

		newValue = objAnim.direction == 'negative' ?
				objAnim.start - objAnim.speed :
				objAnim.start + objAnim.speed;

		_this.style[objAnim.property] = `${newValue}px`;

		if (condition) {
			objAnim.start = newValue;
			requestAnimationFrame(_this.raf.bind(null, objAnim));
		} else {
			if (objAnim.callback) objAnim.callback.call();
		}
	};

  $$.ajax = ajax;
  $$.exists = exists;
  $$.getParam = getParam;
  $$.log = log;
  $$.preload = preload;
  $$.rand = rand;
  $$.scrollPosition = scrollPosition;

  return _this;
})();
