"use strict";

var $$;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}

($$ = function(_$$) {
  function $$() {
    return _$$.apply(this, arguments);
  }

  $$.toString = function() {
    return _$$.toString();
  };

  return $$;
}(function() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
  var el;

  if (typeof selector == 'string') {
    el = document.querySelectorAll(selector).length == 1 ? document.querySelector(selector) : document.querySelectorAll(selector);
  } else if (selector.nodeName) {
    el = selector;
  } else {
    $$.log('Please pass valid selector or node', 'error');
    return;
  }

  var ajax = function ajax() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = options.type || 'ajax',
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

      xhr.onload = function() {
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

      xhr.onerror = function() {
        if (error) error.call();
      };

      xhr.open(method, url, isAsync);

      for (var header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }

      params ? xhr.send(fd) : xhr.send();
    },
    getParam = function getParam(param) {
      var query = location.search.slice(1),
        pairs = query.split('&');
      var key, value;

      for (var pair in pairs) {
        key = pair.split('=')[0];

        if (key == param) {
          value = pair.split('=')[1];
          return value;
        }
      }

      return false;
    },
    log = function log(msg, style) {
      var label = '';

      try {
        var err = new Error();
        label = err.stack.split('\n')[2].split('/').pop().slice(0, -1);
      } catch (e) {
        label = 'Unknown source';
      }

      if (style) {
        if (style in console) {
          console.log("".concat(label, " ->"));
          console[style](msg);
        } else {
          console.log('%c%s', style, "".concat(label, " -> ").concat(msg));
        }
      } else {
        console.log("".concat(label, " -> ").concat(msg));
      }
    },
    loadAsset = function loadAsset(assets, tracker, _callback) {
      var asset = assets[tracker.current];
      ajax({
        url: asset,
        callback: function callback() {
          ++tracker.current;
          prepareAssets(assets, tracker, _callback);
        },
        error: function error() {
          $$.log("Could not preload file: ".concat(asset), 'error');
          ++tracker.current;
          prepareAssets(assets, tracker, _callback);
        }
      });
    },
    prepareAssets = function prepareAssets(assets, tracker, callback) {
      if (tracker.current < tracker.total) {
        loadAsset(assets, tracker, callback);
      } else {
        if (callback) callback.call();
      }
    },
    preload = function preload(assets, callback) {
      var tracker = {
        current: 0,
        total: 0
      };
      if (typeof assets == 'string') assets = [assets];
      tracker.total = assets.length;
      prepareAssets(assets, tracker, callback);
    },
    rand = function rand(min, max, isFloat) {
      var result;

      if (_typeof(min) == 'object' && typeof min != null) {
        var arr = min;
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
    evaluateTouchEvents = function evaluateTouchEvents(el, startEvt, endEvt, evt, fn) {
      var startX = startEvt.changedTouches ? startEvt.changedTouches[0].clientX : startEvt.clientX,
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
          if (Math.abs(startY - endY) > 100 && startY > endY && Math.abs(startX - endX) < 20) {
            fn(evtObj);
          }

          break;

        case 'swiperight':
          if (Math.abs(startX - endX) > 100 && startX < endX && Math.abs(startY - endY) < 20) {
            fn(evtObj);
          }

          break;

        case 'swipedown':
          if (Math.abs(startY - endY) > 100 && startY < endY && Math.abs(startX - endX) < 20) {
            fn(evtObj);
          }

          break;

        case 'swipeleft':
          if (Math.abs(startX - endX) > 100 && startX > endX && Math.abs(startY - endY) < 20) {
            fn(evtObj);
          }

          break;

        case 'tap':
          if (Math.abs(startX - endX) < 10 && Math.abs(startY - endY) < 10) {
            fn(evtObj);
          }

          break;
      }
    },
    initiateTouchEvents = function initiateTouchEvents(el, evt, fn) {
      el.addEventListener('mousedown', function(downEvt) {
        el.addEventListener('mouseup', function(upEvt) {
          evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
        }, {
          once: true
        });
      });
      el.addEventListener('touchstart', function(downEvt) {
        el.addEventListener('touchend', function(upEvt) {
          evaluateTouchEvents(el, downEvt, upEvt, evt, fn);
        }, {
          once: true
        });
      });
    },
    ls = function ls(type, key, value) {
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

  el.addClass = function(cName, delay) {
    setTimeout(function() {
      if (el.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = el[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            item.classList.add(cName);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        el.classList.add(cName);
      }

      return el;
    }, delay || 0);
  };

  el.removeClass = function(cName, delay) {
    setTimeout(function() {
      if (el.length) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = el[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;
            item.classList.remove(cName);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else {
        el.classList.remove(cName);
      }

      return el;
    }, delay || 0);
  };

  el.replaceClass = function(cName, cName2, delay) {
    setTimeout(function() {
      if (el.length) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = el[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;
            item.className = item.className.replace(cName, cName2);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        el.className = el.className.replace(cName, cName2);
      }

      return el;
    }, delay || 0);
  };

  el.css = function(prop, value, delay, callback) {
    if (el.length) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = el[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var item = _step4.value;
          $$(item).css(prop, value, delay, callback);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    } else {
      setTimeout(function() {
        el.style[prop] = value;
      }, delay || 0);
    }

    if (callback) setTimeout(callback, delay);
    return el;
  };

  el.animate = function(props) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var ease = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ease';
    var callback = arguments.length > 4 ? arguments[4] : undefined;
    var transitions = '';

    if (el.length) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = el[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var item = _step5.value;
          $$(item).animate(props, duration, delay, ease, callback);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    } else {
      for (var prop in props) {
        transitions += "".concat(prop, " ").concat(duration, "ms ").concat(ease, ", ");
      }

      transitions = transitions.slice(0, -2);
      el.css('transition', transitions, delay >= 20 ? delay - 20 : delay);

      for (var _prop in props) {
        el.css(_prop, props[_prop], delay);
      }
    }

    if (callback) setTimeout(callback, duration + delay);
    return el;
  };

  el.raf = function() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (el.length) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = el[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var item = _step6.value;
          $$(item).raf(options);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    } else {
      var property = options.property,
        destination = options.destination;
      var start = options.start || el.getBoundingClientRect()[property],
        direction = options.direction || start < destination ? 1 : -1,
        condition = direction == 1 ? start < destination : start > destination,
        speed = options.speed || 1,
        newValue;

      if (condition) {
        newValue = "".concat(start + speed * direction, "px");
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

  el.on = function(evt, fn) {
    switch (evt) {
      case 'swipeup':
      case 'swiperight':
      case 'swipedown':
      case 'swipeleft':
      case 'tap':
        if (el.length) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = el[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var item = _step7.value;
              initiateTouchEvents(item, evt, fn);
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        } else {
          initiateTouchEvents(el, evt, fn);
        }

        break;

      default:
        if (el.length) {
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = el[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _item = _step8.value;

              _item.addEventListener(evt, fn);
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        } else {
          el.addEventListener(evt, fn);
        }

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
}))();
