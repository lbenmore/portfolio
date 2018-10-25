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
