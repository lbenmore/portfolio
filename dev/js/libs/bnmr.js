($$ = (selector) => {
	let el;
	const fns = {};
	
	if (!selector) selector = document;
	
	if (selector.nodeName) {
		el = selector;
	} else {
		el = document.querySelectorAll(selector).length == 1 ? document.querySelector(selector) : document.querySelectorAll(selector);
	}
	
	
	
	const	
	evalTouchPoints = config => {
		let event = {};
		
		const 
		startX = 'changedTouches' in config.startEvt ? config.startEvt.changedTouches[0].clientX : config.startEvt.layerX,
		endX = 'changedTouches' in config.endEvt ? config.endEvt.changedTouches[0].clientX : config.endEvt.layerX,
		startY = 'changedTouches' in config.startEvt ? config.startEvt.changedTouches[0].clientY : config.startEvt.layerY,
		endY = 'changedTouches' in config.endEvt ? config.endEvt.changedTouches[0].clientY : config.endEvt.layerY;
		
		for (const prop in config.endEvt) {
			event[prop] = config.endEvt[prop];
		}
		
		event.originalEvent = {};
		
		for (const prop in config.startEvt) {
			event.originalEvent[prop] = config.startEvt[prop];
		}
		
		event.type = config.evt;
		
		switch (config.evt) {
			case 'swipeup':
				if (
					Math.abs(startY - endY) >= 100
					&& startY > endY
					&& Math.abs(startX - endX) <= 20
				) {
					config.fn.call(null, event);
				}
			break;
			
			case 'swipedown':
				if (
					Math.abs(startY - endY) >= 100
					&& startY < endY
					&& Math.abs(startX - endX) <= 20
				) {
					config.fn.call(null, event);
				}
			break;
			
			case 'swiperight':
				if (
					Math.abs(startX - endX) >= 100
					&& startX < endX
					&& Math.abs(startY - endY) <= 20
				) {
					config.fn.call(null, event);
				}
			break;
			
			case 'swipeleft':
				if (
					Math.abs(startX - endX) >= 100
					&& startX > endX
					&& Math.abs(startY - endY) <= 20
				) {
					config.fn.call(null, event);
				}
			break;
			
			case 'tap':
				if (
					Math.abs(startX - endX) <= 20
					&& Math.abs(startY - endY) <= 20
				) {
					config.fn.call(null, event);
				}
			break;
		}
	},
	
	setTouchPoints = config => {
		if (fns.isMobile()) {
			el. addEventListener('touchstart', startEvt => {
				el.addEventListener('touchend', endEvt => {
					evalTouchPoints({evt: config.evt, fn: config.fn, startEvt, endEvt});
				}, {once: true});
			});
		}
		
		el. addEventListener('mousedown', startEvt => {
			el.addEventListener('mouseup', endEvt => {
				evalTouchPoints({evt: config.evt, fn: config.fn, startEvt, endEvt});
			}, {once: true});
		});
	},
	
	loadAsset = (assetObj, onprogress) => {
		const img = new Image();
		
		img.onload = () => {
			++assetObj.active;
			assetLoadHandler(assetObj, onprogress);
		};
		
		img.src = assetObj.assets[assetObj.active];
	},
	
	assetLoadHandler = (assetObj, onprogress) => {
		onprogress.call(this, assetObj);
		if (assetObj.active < assetObj.total) {
			loadAsset(assetObj, onprogress);
		} else {
			assetObj.callback.call(null, assetObj.assets);
		}
	};
	
	
	
	fns.ajax = options => {
		const 
		type = options.type || 'ajax',
		method = options.method || 'GET',
		reqUrl = options.url || './',
		isAsync = options.async || true,
		params = options.params,
		headers = options.headers,
		callback = options.callback,
		onuploadprogress = options.onuploadprogress || function () {},
		onprogress = options.onprogress || function () {},
		onerror = options.onerror || function () {},
		fd = new FormData();
		xhr = new XMLHttpRequest();
		
		let 
		data;
		
		for (const prm in params) {
			fd.append(prm, params[prm]);
		}
		
		xhr.onload = () => {
			switch (type) {
				case 'json':
					try { data = JSON.parse(xhr.responseText); }
					catch (e) { console.error(e.message); data = xhr.responseText; }
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

		xhr.onerror = onerror;
		xhr.upload.onprogress = onuploadprogress;
		xhr.onprogress = onprogress;
		
		xhr.open(method, reqUrl, isAsync);
		for (const hdr in headers) {
			xhr.setRequestHeader(hdr, headers[hdr]);
		}
		params ? xhr.send(fd) : xhr.send();
	};
	
	fns.isMobile = () => {
		try {
			const dummy = new TouchEvent('DUMMY');
			return true;
		} catch (e) {
			return false;
		}
	};
	
	fns.log = (msg, style) => {
		let label = '';
		
		try {
			const 
			err = new Error(),
			lines = err.stack.split('\n');
			
			if (lines[0] == 'Error') lines.shift();
			
			const
			line = lines[1],
			fileName = line.split('/').pop().split(':')[0],
			lineNo = line.split(':')[line.split(':').length - 2];
			
			let fnName;
			
			switch (true) {
				case line.indexOf('@') > -1:
					fnName = line.split('@')[0];
				break;
				
				case line.indexOf('at') > -1:
					fnName = line.split('at ')[1].split(' ')[0];
				break;
			}
			
			label = `${fileName} -> ${fnName} (${lineNo}) -> `;
		} catch(e) {			
			label = 'Unknown source -> ';
		}
		
		if (style) {
			if (style in console) {
				console[style](`${label}${msg}`);
			} else {
				if (typeof msg == 'object') {
					if (label) console.log('%c%s', style, `${label}`);
					console.dir(msg);
				} else {
					console.log('%c%s', style, `${label}${msg}`);
				}
			}
		} else {
			if (typeof msg == 'object') {
				if (label) console.log(label);
				console.dir(msg);
			} else {
				console.log(`${label}${msg}`);
			}
		}
	};
	
	fns.ls = (type, key, value) => {
		try {
			switch (type) {
				case 'set':
					if (typeof value == 'object') value = JSON.stringify(value);
					localStorage.setItem(key, value);
					return true;
				break;
				
				case 'get':
					return localStorage.getItem(key);
				break;
				
				case 'clear':
					localStorage.clear();
					return true;
				break;
			}
			
			return false;
		} catch (e) {
			return false;
		}
	};
	
	fns.preload = (assets, callback, onprogress) => {
		const assetObj = {
			active: 0,
			assets: [],
			total: 0,
			callback
		};
		
		if (typeof assets == 'string') {
			assetObj.assets = [assets];
		} else {
			assetObj.assets = assets;
		}
		
		assetObj.total = assetObj.assets.length;
		
		assetLoadHandler(assetObj, onprogress);
	};
	
	fns.rand = (min, max, isFloat) => {
		if (typeof min == 'object' && min.length) {
			const 
			arr = min,
			results = [];
			
			while (results.length < arr.length) {
				let i = Math.floor(Math.random() * arr.length);
				
				while (results.includes(arr[i])) {
					i = Math.floor(Math.random() * arr.length);
				}
				
				results.push(arr[i]);
			}
			
			return results;
		} else {
			return isFloat 
				? Math.random() * (max - min + 1) + min
				: Math.floor(Math.random() * (max - min + 1) + min);
		}
	};
	
	for (const fn in fns) {
		$$[fn] = fns[fn];
	}
	
	
	
	el.on = (evt, fn) => {
		if (el.length) {
			for (let item of el) $$(item).on(evt, fn);
		} else {
			switch (evt) {
				case 'swipeup':
				case 'swiperight':
				case 'swipedown':
				case 'swipeleft':
				case 'tap':
					setTouchPoints({evt, fn});
				break;
				
				default:
					el.addEventListener(evt, fn);
				break;
			}
		}
	
		return el;
	};
	
	el.css = (property, value, delay, callback) => {
		if (el.length) {
			for (const item of el) $$(item).css(property, value, delay);
		} else {
			setTimeout(() => {
				el.style[property] = value;
			}, delay || 0);
		}
		
		setTimeout(() => {
			if (callback) callback.call();
		}, delay || 0);
	
		return el;
	};
	
	el.animate = (properties, duration = 500, delay = 0, ease = 'ease', callback) => {
		if (el.length) {
			for (const item of el) $$(item).animate(properties, duration, delay, ease);
		} else {
			const setTime = delay >= 20 ? delay - 20 : delay;
			let transitions = '';
			
			for (const prop in properties) {
				transitions += `${prop} ${duration}ms ${ease}, `;
			}
			transitions = transitions.slice(0, -2);
			
			$$(el).css('transition', transitions, setTime);
			
			for (const prop in properties) {
				$$(el).css(prop, properties[prop], delay);
			}
		}
		
		setTimeout(() => {
			if (callback) callback.call();
		}, delay || 0);
	
		return el;
	};
	
	
	
	return el;
})();