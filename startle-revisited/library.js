// JavaScript Document

var bnmr = {};
bnmr.vars = {};
bnmr.fns = {};

bnmr.$ = function (selector) {
	var _this;
	_this = selector.slice(0, 1) == '#' ? document.querySelector(selector) : document.querySelectorAll(selector);
	(typeof _this == 'object' && _this.length == 1) ? _this = _this[0] : null;

	_this.listener = function (event, callback) {
		if (window.addEventListener) {
			_this.addEventListener(event, callback);
		} else {
			_this.attachEvent('on' + event, callback);
		}
	};

	_this.execTouch = function (e, event, callback) {
		switch (event) {
			case 'swipeleft':
				if (Math.abs(bnmr.vars.startX - bnmr.vars.endX) > 100 && bnmr.vars.startX > bnmr.vars.endX) {
					callback(e);
				}
			break;

			case 'swiperight':
				if (Math.abs(bnmr.vars.startX - bnmr.vars.endX) > 100 && bnmr.vars.startX < bnmr.vars.endX) {
					callback(e);
				}
			break;

			case 'swipeup':
				if (Math.abs(bnmr.vars.startY - bnmr.vars.endY) > 100 && bnmr.vars.startY > bnmr.vars.endY) {
					callback(e);
				}
			break;

			case 'swipedown':
				if (Math.abs(bnmr.vars.startY - bnmr.vars.endY) > 100 && bnmr.vars.startY < bnmr.vars.endY) {
					callback(e);
				}
			break;

			case 'tap':
				if (Math.abs(bnmr.vars.startX - bnmr.vars.endX) < 50 && Math.abs(bnmr.vars.startY - bnmr.vars.endY) < 50) {
					callback(e);
				}
			break;

			default:
			break;
		}
	};

	_this.evalTouch = function (event, callback) {
		var hasMouseUp = false;

		_this.on('mousedown', function (e) {
			bnmr.vars.startX = e.clientX;
			bnmr.vars.startY = e.clientY;
		});
		_this.on('touchstart', function (e) {
			bnmr.vars.startX = e.changedTouches[0].clientX;
			bnmr.vars.startY = e.changedTouches[0].clientY;
		});

		_this.on('mouseup', function (e) {
			hasMouseUp = true;
			
			bnmr.vars.endX = e.clientX;
			bnmr.vars.endY = e.clientY;
			_this.execTouch(e, event, callback);
		});
		_this.on('touchend', function (e) {
			if (!hasMouseUp) {
				bnmr.vars.endX = e.changedTouches[0].clientX;
				bnmr.vars.endY = e.changedTouches[0].clientY;
				_this.execTouch(e, event, callback);
			}
		});
	};

	_this.on = function (event, callback) {
		switch (event) {
			case 'swipeleft':
			case 'swiperight':
			case 'swipeup':
			case 'swipedown':
			case 'tap':
				_this.evalTouch(event, callback);
			break;

			default:
				_this.listener(event, callback);
			break;
		}
	};

	_this.addClass = function (cName, delay) {
		setTimeout(function () {
			if (document.body.classList) {
				_this.classList.add(cName);
			} else {
				_this.className += ' ' + cName;
			}
		}, delay || 0);
	};

	_this.removeClass = function (cName, delay) {
		setTimeout(function () {
			if (document.body.classList) {
				_this.classList.remove(cName);
			} else {
				_this.className = _this.className.replace(cName, '');
			}
		}, delay || 0);
	};

	_this.replaceClass = function (cName, cName2, delay) {
		setTimeout(function () {
			_this.className = _this.className.replace(cName, cName2);
		}, delay || 0);
	};

	_this.toggleClass = function (cName, delay) {
		if (_this.className.indexOf(cName) > -1) {
			_this.removeClass(cName, delay);
		} else {
			 _this.addClass(cName, delay);
		 }
	};

	return _this;
};

bnmr.fns.initClockFace = function () {
	setInterval(function () {
		var date = new Date(),
				hour = date.getHours(),
				minute = date.getMinutes(),
				second = date.getSeconds(),
				strHour,
				strMinute;

		if (hour == 0) {
			strHour = String(12);
		} else if (hour > 12) {
			strHour = String(hour - 12);
		} else {
			strHour = String(hour);
		}

		if (String(minute).length == 1) {
			strMinute = '0' + minute;
		} else {
			strMinute = String(minute);
		}

		// Digital Face
		bnmr.$('.display__digit--hour').innerHTML = strHour;
		bnmr.$('.display__digit--minute').innerHTML = strMinute;

		// Analog Face
		bnmr.$('.clock__hand--second').style.webkitTransform = 'rotate(' + second * 6 + 'deg) translateY(-100%)';
		bnmr.$('.clock__hand--minute').style.webkitTransform = 'rotate(' + minute * 6 + 'deg) translateY(-100%)';
		bnmr.$('.clock__hand--hour').style.webkitTransform = 'rotate(' + hour * 30 + 'deg) translateY(-100%)';

		bnmr.$('.clock__hand--second').style.transform = 'rotate(' + second * 6 + 'deg) translateY(-100%)';
		bnmr.$('.clock__hand--minute').style.transform = 'rotate(' + minute * 6 + 'deg) translateY(-100%)';
		bnmr.$('.clock__hand--hour').style.transform = 'rotate(' + hour * 30 + 'deg) translateY(-100%)';
	}, 1000);
};

bnmr.fns.togglePanel = function () {
	switch (bnmr.vars.panelState) {
		case 'clock':
			bnmr.$('.clock').toggleClass('hidden');
			bnmr.$('.config').toggleClass('hidden');

			bnmr.vars.panelState = 'config';
		break;

		case 'config':
			bnmr.$('.clock').toggleClass('hidden');
			bnmr.$('.config').toggleClass('hidden');


			bnmr.vars.panelState = 'clock';
		break;

		default:
			console.error('Something has gone awry!');
		break;
	}
};

bnmr.fns.closeResetConfig = function () {
	bnmr.$('.options__dropdown--time').value = '';
	bnmr.$('.options__dropdown--sound').value = '';
	bnmr.$('.options__dropdown--gestures').value = '';

	bnmr.$('.config__options').addClass('hidden');
};

bnmr.fns.optionsCancel = function () {
	switch (bnmr.vars.configState) {
		case 'add':
			bnmr.fns.closeResetConfig();
		break;

		case 'edit':
			bnmr.fns.alarms('remove');
		break;
	}
};

bnmr.fns.optionsSubmit = function () {
	switch (bnmr.vars.configState) {
		case 'add':
			if (bnmr.$('.options__dropdown--time').value &&
					bnmr.$('.options__dropdown--sound').value &&
					bnmr.$('.options__dropdown--gestures').value) {

				bnmr.fns.alarms('set');
			} else {
				for (var i = 0; i < bnmr.$('.options__dropdown').length; i++) {
					if (!bnmr.$('.options__dropdown')[i].value) {
						bnmr.$('.options__dropdown')[i].className += ' invalid';
					}
				}
			}
		break;

		case 'edit':
			bnmr.fns.alarms('update');
		break;
	}
};

bnmr.fns.editAlarm = function (liAlarm) {
	bnmr.vars.configState = 'edit';
	bnmr.vars.selectedAlarm = liAlarm.getAttribute('data-alarm-id');

	bnmr.$('.options__btn--submit').innerHTML = 'Update';
	bnmr.$('.options__btn--cancel').innerHTML = 'Delete';

	bnmr.$('.options__dropdown--time').value = liAlarm.getAttribute('data-alarm-time');
	bnmr.$('.options__dropdown--sound').value = liAlarm.getAttribute('data-alarm-sound');
	bnmr.$('.options__dropdown--gestures').value = liAlarm.getAttribute('data-alarm-gestures');

	bnmr.$('.config__options').removeClass('hidden');
};

bnmr.fns.addAlarm = function () {
	bnmr.vars.configState = 'add';

	bnmr.$('.options__btn--submit').innerHTML = 'Save';
	bnmr.$('.options__btn--cancel').innerHTML = 'Cancel';

	bnmr.$('.config__options').removeClass('hidden');
};

bnmr.fns.buildAlarmList = function () {
	for (var i = document.querySelectorAll('.list__li--alarm').length; i < bnmr.vars.alarms.length; i++) {
		var liAlarm = document.createElement('li');
		liAlarm.innerHTML = bnmr.vars.alarms[i].name;
		liAlarm.className = 'list__li list__li--alarm';
		liAlarm.setAttribute('data-alarm-name', bnmr.vars.alarms[i].name);
		liAlarm.setAttribute('data-alarm-time', bnmr.vars.alarms[i].time);
		liAlarm.setAttribute('data-alarm-sound', bnmr.vars.alarms[i].sound);
		liAlarm.setAttribute('data-alarm-gestures', bnmr.vars.alarms[i].gestures);
		liAlarm.setAttribute('data-alarm-id', bnmr.vars.alarms[i].id);

		liAlarm.addEventListener('mouseup', function (e) {
			bnmr.fns.editAlarm(e.target);
		});

		bnmr.$('.list__ul').insertBefore(liAlarm, bnmr.$('.list__li--delete'));
	}
};

bnmr.fns.alarms = function (type) {
	switch (type) {
		case 'get':
			bnmr.vars.alarms = [];

			if (window.localStorage) {
				if (localStorage.getItem('alarms')) {
					bnmr.vars.alarms = JSON.parse(localStorage.getItem('alarms'));
				}
			}
		break;

		case 'set':
			var hour, min, mer, name,
					newAlarm = {};

			newAlarm["id"] = String(new Date().getTime());
			newAlarm["time"] = bnmr.$('.options__dropdown--time').value;
			newAlarm["sound"] = bnmr.$('.options__dropdown--sound').value;
			newAlarm["gestures"] = bnmr.$('.options__dropdown--gestures').value;

			hour = bnmr.$('.options__dropdown--time').value.split(':')[0];
			min = bnmr.$('.options__dropdown--time').value.split(':')[1];
			mer = hour > 12 ? 'PM' : 'AM';
			hour = hour > 12 ? hour - 12 : hour;
			hour = hour == 0 ? 12 : hour;
			hour = String(hour).slice(0, 1) == '0' ? hour.slice(1, hour.length) : hour;

			name = hour + ':' + min + ' ' + mer;

			newAlarm["name"] = name;

			bnmr.vars.alarms.push(newAlarm);
			bnmr.fns.closeResetConfig();

			if (window.localStorage) {
				localStorage.setItem('alarms', JSON.stringify(bnmr.vars.alarms));
			}
		break;

		case 'update':
			var itemToUpdate, name, hour, min, mer;

			for (var i = 0; i < bnmr.vars.alarms.length; i++) {
				if (bnmr.vars.alarms[i].id == bnmr.vars.selectedAlarm) {
					itemToUpdate = bnmr.vars.alarms[i];
					break;
				}
			}

			itemToUpdate["time"] = bnmr.$('.options__dropdown--time').value;
			itemToUpdate["sound"] = bnmr.$('.options__dropdown--sound').value;
			itemToUpdate["gestures"] = bnmr.$('.options__dropdown--gestures').value;

			hour = bnmr.$('.options__dropdown--time').value.split(':')[0];
			min = bnmr.$('.options__dropdown--time').value.split(':')[1];
			mer = hour > 12 ? 'PM' : 'AM';
			hour = hour > 12 ? hour - 12 : hour;
			hour = hour == 0 ? 12 : hour;
			hour = String(hour).slice(0, 1) == '0' ? hour.slice(1, hour.length) : hour;

			name = hour + ':' + min + ' ' + mer;

			itemToUpdate["name"] = name;

			document.querySelector('.list__li--alarm[data-alarm-id="' + bnmr.vars.selectedAlarm + '"]').innerHTML = name;
			document.querySelector('.list__li--alarm[data-alarm-id="' + bnmr.vars.selectedAlarm + '"]').setAttribute('data-alarm-time', itemToUpdate["time"]);
			document.querySelector('.list__li--alarm[data-alarm-id="' + bnmr.vars.selectedAlarm + '"]').setAttribute('data-alarm-sound', itemToUpdate["sound"]);
			document.querySelector('.list__li--alarm[data-alarm-id="' + bnmr.vars.selectedAlarm + '"]').setAttribute('data-alarm-gestures', itemToUpdate["gestures"]);

			bnmr.fns.closeResetConfig();

			if (window.localStorage) {
				localStorage.setItem('alarms', JSON.stringify(bnmr.vars.alarms));
			}
		break;

		case 'remove':
			for (var i = 0; i < bnmr.vars.alarms.length; i++) {
				if (bnmr.vars.alarms[i].id == bnmr.vars.selectedAlarm) {
					bnmr.vars.alarms.splice(i, 1);
					bnmr.$('.list__ul').removeChild(document.querySelector('.list__li--alarm[data-alarm-id="' + bnmr.vars.selectedAlarm + '"]'));
				}
			}

			if (window.localStorage) {
				localStorage.setItem('alarms', JSON.stringify(bnmr.vars.alarms));
			}
		break;

		case 'clear':
			var currAlarms = document.querySelectorAll('.list__li--alarm');
			bnmr.vars.alarms = [];

			for (var i = 0; i < currAlarms.length; i++) {
				bnmr.$('.list__ul').removeChild(currAlarms[i]);
			}

			if (window.localStorage) {
				localStorage.setItem('alarms', '');
			}
		break;
	}

	bnmr.fns.buildAlarmList();
};

bnmr.fns.stopAlarm = function () {
	setTimeout(bnmr.fns.checkForAlarm, 58000);
	bnmr.$('#sounds').pause();
};

bnmr.fns.startAlarm = function () {
	var randGest = bnmr.vars.arrGestures[(Math.floor(Math.random() * bnmr.vars.arrGestures.length))],
			overlay = document.createElement('div');

	bnmr.$('#sounds').currentTime = bnmr.vars.objSounds[bnmr.vars.alarmSound].start;
	bnmr.$('#sounds').play();
	bnmr.$('#sounds').ontimeupdate = function () {
		if (bnmr.$('#sounds').currentTime >= bnmr.vars.objSounds[bnmr.vars.alarmSound].end) {
			bnmr.$('#sounds').currentTime = bnmr.vars.objSounds[bnmr.vars.alarmSound].start;
		}
	};

	overlay.innerHTML = randGest;
	overlay.className = 'overlay';

	document.body.appendChild(overlay);

	bnmr.$('.overlay').on(randGest, function () {
		document.body.removeChild(overlay);

		if (bnmr.vars.numGesturesLeft > 1) {
			bnmr.vars.numGesturesLeft--;
			bnmr.fns.startAlarm();
		} else {
			bnmr.fns.stopAlarm();
		}
	});
};

bnmr.fns.checkForAlarm = function () {
	bnmr.vars.alarmInterval = setInterval(function () {
		var now, nHour, nMin, aHour, aMin;
		now = new Date();
		nHour = String(now.getHours());
		nMin = String(now.getMinutes());

		for (var i = 0; i < bnmr.vars.alarms.length; i++) {
			aHour = bnmr.vars.alarms[i].time.split(':')[0];
			aMin = bnmr.vars.alarms[i].time.split(':')[1];

			if (nHour == aHour) {
				if (nMin == aMin) {
					clearInterval(bnmr.vars.alarmInterval);
					bnmr.vars.numGesturesLeft = bnmr.vars.alarms[i].gestures;
					bnmr.vars.alarmSound = bnmr.vars.alarms[i].sound;
					bnmr.fns.startAlarm();
					break;
				}
			}
		}
	}, 1000);
};

bnmr.fns.eventListeners = function () {
	bnmr.$('.icn--info').on('tap', bnmr.fns.togglePanel);
	bnmr.$('.list__li--add').on('tap', bnmr.fns.addAlarm);
	bnmr.$('.list__li--delete').on('tap', bnmr.fns.alarms.bind(this, 'clear'));
	bnmr.$('.options__btn--submit').on('tap', bnmr.fns.optionsSubmit);
	bnmr.$('.options__btn--cancel').on('tap', bnmr.fns.optionsCancel);
	
	var firstRun = true;
	bnmr.$('.container').on('tap', function () {
		if (firstRun) {
			bnmr.$('#sounds').play();
			bnmr.$('#sounds').pause();
			firstRun = false;
		}
	});
};

bnmr.fns.init = function () {
	bnmr.vars.panelState = 'clock';

	bnmr.vars.arrGestures = [
		'swipeup',
		'swiperight',
		'swipedown',
		'swipeleft'
	];

	bnmr.vars.objSounds = {
		"baby": {
			"start": "0",
			"end": "12"
		},
		"siren": {
			"start": "14",
			"end": "24"
		},
		"worst": {
			"start": "24",
			"end": "27"
		},
		"game": {
			"start": "30",
			"end": "36"
		},
		"drill": {
			"start": "35",
			"end": "39"
		}
	};
	
	bnmr.$('#sounds').play();
	bnmr.$('#sounds').pause();

	bnmr.fns.alarms('get');
	bnmr.fns.initClockFace();
	bnmr.fns.eventListeners();

	bnmr.fns.checkForAlarm();
};

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		bnmr.fns.init();
	}
};
