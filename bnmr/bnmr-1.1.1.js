// JavaScript Document
const $$ = (sel) => {
	let _this,
			el = sel || 'body';

  el.slice(0, 1) == '#' ? _this = document.querySelector(el) : _this = document.querySelectorAll(el);
	(typeof _this == 'object' && _this.length == 1) ? _this = _this[0] : null;

  const
  loader = (asset) => {
    switch (asset.split('.')[(asset.split('.').length - 1)].toLowerCase()) {
      case 'bmp':
      case 'gif':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'tiff':
          new Image().src = asset;
      break;

      case 'mp4':
      case 'ogv':
      case 'webm':
        let video = document.createElement('video');
        video.src = asset;
        video.load();
      break;

      default:
        console.log('Something has gone awry in loader!');
      break;
    }
  },

  preload = (asset) => {
    switch (typeof asset) {
      case 'string':
        loader(asset);
      break;

      case 'object':
        for (let ast of asset) {
          loader(ast);
        }
      break;
    }
  },

	loadAsset = (asset) => {
		let ext = asset.split('.')[asset.split('.').length - 1].toLowerCase();

		switch (ext) {
			case 'css':
				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = asset;

				let head = document.getElementsByTagName('head')[0];
				head.appendChild(link);
			break;

			case 'js':
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.async = 'true';
				script.src = asset;

				document.body.appendChild(script);
			break;
		}
	},

	load = (assets, callback) => {
		if (assets instanceof Array) {
			for (i = 0; i < assets.length; i++) {
				loadAsset(assets[i]);
			}
		} else {
			loadAsset(assets);
		}

		if (callback) {
			callback();
		}
	},

  ajax = (options, callback, file) => {
    let xhr,
    		type = options.type || 'ajax',
        method = options.method || 'GET',
        url = options.url || '',
        isAsync = options.async || true;

    xhr = new XMLHttpRequest();
    xhr.open(method, url, isAsync);

		if (file) {
			xhr.setRequestHeader('X_FILENAME', file.name);
			xhr.send(file);
		} else {
      xhr.send();
		}

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
      	if (callback) {
			    switch (type) {
			    	case 'json':
				        callback(JSON.parse(xhr.responseText));
			    	break;

			    	default:
				        callback(xhr.responseText);
			    	break;
			    }
      	}
      }
    };
  },

  isMobile = () => {
    return (/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i).test(navigator.userAgent);
  },

  rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  getParam = (param) => {
    if (window.location.search && window.location.search != '') {
      let params = window.location.search.replace('?', ''),
          pairs = params.split('&');

      for (let pair of pairs) {
        let key = pair.split('=')[0];
        if (key == param) {
          let value = pair.split('=')[1];
          return value;
        }
      }
    }
  },

	contains = (string, substring) => {
		return string.indexOf(substring) > -1;
	},

	addCSS = (el, prop, val) => {
		let ss = document.styleSheets[document.styleSheets.length - 1];

		if (ss) {
			const sslen = ss.cssRules ? ss.cssRules.length : ss.rules.length;
			ss.insertRule(el + ' {' + prop + ': ' + val + '; }', sslen);
		} else if (document.getElementsByTagName('style').length) {
			let styleTag = document.getElementsByTagName('style')[document.getElementsByTagName('style').length - 1];
			styleTag.innerHTML += ' \r' + el + '{' + prop + ':' + val + '}';
		} else {
			let styleTag = document.createElement('style');
			styleTag.innerHTML = el + '{' + prop + ':' + val + '}';
		}
	},

	evalTouch = (dir, fn) => {
		let startTouch, endTouch;

		_this.addEventListener('touchstart', (e) => {
			e.preventDefault();
			startTouch = {
				'x' : e.touches[0].clientX,
				'y' : e.touches[0].clientY
			};
		});

		_this.addEventListener('touchend', (e) => {
			e.preventDefault();
			endTouch = {
				'x' : e.changedTouches[0].clientX,
				'y' : e.changedTouches[0].clientY
			};

			switch (dir) {
				case 'tap':
					if (Math.abs(startTouch.x - endTouch.x) < 100 && Math.abs(startTouch.y - endTouch.y) < 100) {
						fn();
					}
				break;

				case 'left':
					if (Math.abs(startTouch.x - endTouch.x) > 100 && startTouch.x > endTouch.x) {
						fn();
					}
				break;

				case 'right':
					if (Math.abs(startTouch.x - endTouch.x) > 100 &&startTouch.x < endTouch.x) {
						fn();
					}
				break;

				case 'up':
					if (Math.abs(startTouch.y - endTouch.y) > 100 && startTouch.y > endTouch.y) {
						fn();
					}
				break;

				case 'down':
					if (Math.abs(startTouch.y - endTouch.y) > 100 &&startTouch.y < endTouch.y) {
						fn();
					}
				break;
			}
		});

	};

  _this.on = (evt, fn) => {
    switch (evt) {
      case 'swipeleft':
				evalTouch('left', fn);
      break;

      case 'swiperight':
				evalTouch('right', fn);
      break;

      case 'swipeup':
				evalTouch('up', fn);
      break;

      case 'swipedown':
				evalTouch('down', fn);
      break;

      case 'tap':
				evalTouch('tap', fn);
      break;

			case 'click':
			case 'mouseover':
			case 'mouseout':
			case 'mousemove':
			case 'keydown':
			case 'keypress':
			case 'keyup':
				if (window.addEventListener) {
					_this.addEventListener(evt, fn);
				} else {
					_this.attachEvent('on' + evt, fn);
				}
			break;
    }
  },

	_this.css = (prop, val, del) => {
		let delay = del || 0;

		setTimeout(function () {
			if (_this.length) {
			  for (let el of _this) {
			    el.style[prop] = val;
			  }
			} else {
			  _this.style[prop] = val;
			}
		}, delay);
	};

	_this.animate = (props, dur, del, eas) => {
		let transitionStyles = [],
			duration = dur || 500,
			delay = del || 0;
			ease = eas || 'ease';

		for (let prop in props) {
			transitionStyles.push(prop + ' ' + duration + 'ms ' + ' ' + ease);
		}

		transitionStyles = transitionStyles.join(', ');

		if (_this.length) {
		  for (let el of _this) {
		    el.style.transition = transitionStyles;
		  }
		} else {
		  _this.style.transition = transitionStyles;
		}


		for (let prop in props) {
  		_this.css(prop, props[prop], delay);
		}
	};

	_this.addClass = (cName, delay) => {
		setTimeout(() => {
			if (document.body.classList) {
				_this.classList.add(cName);
			} else {
				_this.className += ' ' + cName;
			}
		}, delay || 0);
	};

	_this.removeClass = (cName, delay) => {
		setTimeout(() => {
			if (document.body.classList) {
				_this.classList.remove(cName);
			} else {
				_this.className = _this.className.replace(' ' + cName, '');
			}
		}, delay || 0);
	};

	_this.replaceClass = (cName1, cName2, delay) => {
		setTimeout(() => {
			_this.className = _this.className.relace(cName1, cName2);
		}, delay || 0);
	};

	_this.toggleClass = (cName, delay) => {
		setTimeout(() => {
			if (_this.className.indexOf(cName) == -1) {
				_this.addClass(cName);
			} else {
				_this.removeClass(cName);
			}
		}, delay || 0);
	};

  $$.addCSS = addCSS;
  $$.ajax = ajax;
  $$.contains = contains;
  $$.getParam = getParam;
  $$.isMobile = isMobile;
  $$.preload = preload;
  $$.rand = rand;

  return _this;
};

$$();
