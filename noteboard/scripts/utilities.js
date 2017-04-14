// JavaScript Document

var bnmr = {};

bnmr.$ = function (selector) {
  var _this;
  selector.slice(0, 1) == '#' ? _this = document.querySelector(selector) : _this = document.querySelectorAll(selector);
  (typeof _this == 'object' && _this.length == 1) ? _this = _this[0] : null;

  _this.addClass = function (cName, delay) {
    setTimeout(function () {
      if (document.body.classList) {
        _this.classList.add(cName);
      } else {
        _this.className += ' ' + cName;
      }
    }, delay || 0);
  }

  _this.removeClass = function (cName, delay) {
    setTimeout(function () {
      if (document.body.classList) {
        _this.classList.remove(cName);
      } else {
        _this.className = _this.className.replace(' ' + cName, '');
      }
    }, delay || 0);
  };

  _this.replaceClass = function (cName1, cName2, delay) {
    setTimeout(function () {
      _this.className = _this.className.replace(cName1, cName2);
    }, delay || 0);
};

  return _this;
};

bnmr.log = function (msg, type) { err = new Error();
  var type = type || 'log',
      err = new Error(),
      stack = err.stack,
      caller = stack.split('at ')[err.stack.split('at ').length - 1];

  if (window.console.dir && typeof msg != 'string') {
    console[type](caller + ':');
    console.dir(msg);
  } else {
    console[type](caller + ':\n' + msg);
  }
};

bnmr.ajax = function (options, callback, params) {
  var reqType = options.type || 'ajax',
      method = options.method || 'GET',
      url = options.url || './',
      isAsync = options.async || true,
      xhr,
      data;

  xhr = new XMLHttpRequest();
  xhr.open(method, url, isAsync);

  if (reqType == 'upload') {
    xhr.setRequestHeader('X-FILENAME', params[0].name);
  }

  if (params) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  } else {
    xhr.send();
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      switch (reqType) {
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
};

bnmr.readCookie = function (param) {
    var _cookie = document.cookie,
    _key = _cookie.split('=')[0];

    if (_cookie) {
      if (_cookie.indexOf('; ') > -1) {
        var _pairs = _cookie.split('; ');

        for (var i = 0; i < _pairs.length; i++) {
          var _key = _pairs[i].split('=')[0];
          if (_key == param) {
            var _value = _pairs[i].split('=')[1];
            return _value;
          }
        }
      } else {
        if (_key == param) {
          var _value = _cookie.split('=')[1];
          return _value;
        }
      }
    } else {
      return false;
    }
};


bnmr.loadScreen = function () {
  this.overlay = document.createElement('div');
  this.overlay.style.position = 'fixed';
  this.overlay.style.top = '0';
  this.overlay.style.right = '0';
  this.overlay.style.bottom = '0';
  this.overlay.style.left = '0';
  this.overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
  this.overlay.style.fontFamily = '"Ubuntu", "Lucida Sans Unicode", Lato, Arial, sans-serif';
  this.overlay.style.textAlign = 'center';
  this.overlay.style.lineHeight = '100vh';

  this.overlay.innerHTML = 'Loading...';

  document.body.appendChild(this.overlay);

  this.remove = function () {
    document.body.removeChild(this.overlay);
  }
}
