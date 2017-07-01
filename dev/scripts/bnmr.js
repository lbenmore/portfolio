// JavaScript Document

($$ = (selector) => {
  let
  _this,

  // $$.___() FUNCTIONS
  ajax,
  log,

  // HELPER FUNCTIONS
  evalTouch,
  execTouch,

  // GLOBAL VARIABLE HOLDER
  globals = {};

    ///////////////////
   // DOM SELECTION //
  ///////////////////

  selector = !selector ? 'body' : selector;
  _this = selector.slice(0, 1) == `#` ? document.querySelector(selector) : document.querySelectorAll(selector);
  _this = (typeof _this == `object` && _this.length == 1) ? _this[0] : _this;


    ////////////////////
   // EVENT HANDLING //
  ////////////////////

  _this.listener = (evt, fn) => {
    if (window.addEventListener) {
      _this.addEventListener(evt, fn);
    } else {
      _this.attachEvent(`on${evt}`, fn);
    }
  };

  execTouch = (e, evt, fn) => {
    switch (evt) {
      case `swipeup`:
        if (Math.abs(globals.startY - globals.endY > 100) && globals.startY > globals.endY) {
          fn(e);
        }
      break;

      case `swipedown`:
        if (Math.abs(globals.startY - globals.endY > 100) && globals.startY < globals.endY) {
          fn(e);
        }
      break;

      case `swipeleft`:
        if (Math.abs(globals.startX - globals.endX > 100) && globals.startX > globals.endX) {
          fn(e);
        }
      break;

      case `swiperight`:
        if (Math.abs(globals.startX - globals.endX > 100) && globals.startX < globals.endX) {
          fn(e);
        }
      break;

      case `tap`:
        if (Math.abs(globals.startX - globals.endX < 50) && Math.abs(globals.startY - globals.endY < 50)) {
          fn(e);
        }
      break;
    }
  };

  evalTouch = (evt, fn) => {
    let isTouch = false;

    _this.on(`touchstart`, function (e) {
      isTouch = true;

      globals.startX = e.changedTouches[0].clientX;
      globals.startY = e.changedTouches[0].clientY;
    });
    _this.on(`mousedown`, function (e) {
      globals.startX = e.clientX;
      globals.startY = e.clientY;
    });

    _this.on(`touchend`, function (e) {
      globals.endX = e.changedTouches[0].clientX;
      globals.endY = e.changedTouches[0].clientY;

      execTouch(e, evt, fn);
    });
    _this.on(`mouseup`, function (e) {
      if (!isTouch) {
        globals.endX = e.clientX;
        globals.endY = e.clientY;

        execTouch(e, evt, fn);
      }
    });
  };

  _this.on = (evt, fn) => {
    switch (evt) {
      case `swipeup`:
      case `swipedown`:
      case `swipeleft`:
      case `swiperight`:
      case `tap`:
        evalTouch(evt, fn);
      break;

      default:
        _this.listener(evt, fn);
      break;
    }
  };


    //////////////////////////////////
   // CLASS MANIPULATION FUNCTIONS //
  //////////////////////////////////

  _this.addClass = (cName, delay) => {
    setTimeout(() => {
      if (document.body.classList) {
        if (!_this.classList.contains(cName)) {
          _this.classList.add(cName);
        }
      } else {
        if (_this.className.indexOf(cName) == -1) {
          _this.className += ` ${cName}`;
        }
      }
    }, delay || 0);
  };

  _this.removeClass = (cName, delay) => {
    setTimeout(() => {
      if (document.body.classList) {
        _this.classList.remove(cName);
      } else {
        _this.className = _this.className.replace(new RegExp(cName, `g`), ``);
      }
    }, delay || 0);
  };

  _this.replaceClass = (cName, cName2, delay) => {
    setTimeout(() => {
      _this.className = _this.className.replace(new RegExp(cName, `g`), cName2);
    }, delay || 0);
  };

  _this.toggleClass = (cName, delay) => {
    setTimeout(() => {
      if (document.body.classList.toggle) {
        _this.classList.toggle(cName);
      } else {
        if (_this.className.indexOf(cName) == -1) {
          _this.addClass(cName);
        } else {
          _this.removeClass(cName);
        }
      }
    }, delay || 0);
  };


    ///////////////////////////////////
   // STYLE AND ANIMATION FUNCTIONS //
  ///////////////////////////////////

  _this.css = (prop, val, del) => {
    let delay = typeof prop == `string` ? del : val;

    setTimeout(() => {
      if (typeof prop == `string`) {
        _this.style[prop] = val;
      } else {
        for (let property in prop) {
          _this.style[property] = prop[property];
        }
      }
    }, delay || 0);
  };

  _this.animate = (properties, duration, delay, ease) => {
    let
    props = properties,
    dur = duration || 500,
    del = delay || 0,
    eas = ease || `ease`,
    transitionStyles = ``;

    if (_this.style.transition && _this.style.transition != ``) {
      transitionStyles = _this.style.transition;
    }

    for (let prop in props) {
      transitionStyles += `${prop} ${dur}ms ${eas},`;
      _this.css(property, props[property], delay);
    }

    transitionStyles = transitionStyles.slice(0, transitionStyles.length - 1);

    _this.style.transition = transitionStyles;
    _this.style.webkitTransition = transitionStyles;
  };


    ///////////////////////
   // UTILITY FUNCTIONS //
  ///////////////////////

  ajax = (options, callback) => {
    let
    xhr = new XMLHttpRequest(),
    type = options.type || `ajax`,
    method = options.method || `GET`,
    url = options.url || `./`,
    isAsync = options.async || true,
    params = options.params || null,
    data;

    xhr.open(method, url, isAsync);
    params ? xhr.send(params) : xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        switch (type) {
          case `json`:
            data = JSON.parse(xhr.responseText);
          break;

          case `xml`:
            data = xhr.responseXML;
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
    };
  };

  log = (msg, type) => {
    let logType = type || `log`;

    if (window.console.dir && typeof msg == `object`) {
      console.dir(msg);
    } else {
      console[logType](msg);
    }
  };

  $$.ajax = ajax;
  $$.log = log;

  return _this;
})();
