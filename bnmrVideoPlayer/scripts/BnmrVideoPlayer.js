var BnmrVideoPlayer = function () {
	var _this = this,
		bnmr = {};
		bnmr.vars = {};
		bnmr.els = {};
		bnmr.fns = {};


	// VARIABLE DECLARATIONS
	bnmr.vars.rand = Math.floor(Math.random() * 10000000000);


	// UTILITIY FUNCTIONS
	bnmr.fns.log = function (msg) {
		if (window.console.dir) {
			console.dir(msg);
		} else {
			console.log(msg);
		}
	}

	bnmr.fns.addClass = function (el, cName, delay) { 
		setTimeout(function () {
			if (document.body.classList) {
				el.classList.add(cName);
			} else {
				el.className += ' ' + cName;
			}
		}, delay || 0);
	}

	bnmr.fns.removeClass = function (el, cName, delay) { 
		setTimeout(function () {
			if (document.body.classList) {
				el.classList.remove(cName);
			} else {
				el.className = el.className.replace(' ' + cName, '');
			}
		}, delay || 0);
	}

	bnmr.fns.replaceClass = function (el, cName1, cName2, delay) {
		setTimeout(function () {
			el.className = el.className.replace(cName1, cName2);
		}, delay || 0);
	}


	// PRIVATE FUNCTIONS
	bnmr.fns.initPlayer = function () {
		// GET ELEMENT TO PLACE VIDEO IN
		bnmr.els.locationElement = document.querySelector(bnmr.vars.location);

		// STYLIZE DIV FOR VIDEO PLAYER
		bnmr.vars.width != 'auto' ? bnmr.els.locationElement.style.width = bnmr.vars.width + 'px' : null;
		bnmr.vars.height != 'auto' ? bnmr.els.locationElement.style.height = bnmr.vars.height + 'px' : null;

		// CREATE VIDEO ELEMENT
		bnmr.els.vidEl = document.createElement('video');

		// SET IDS TO REFERENCE LATER
		bnmr.els.locationElement.className += ' BnmrVideoPlayer_' + bnmr.vars.rand;
		bnmr.els.vidEl.id = 'BnmrVideo_' + bnmr.vars.rand;

		// FOR PLAYLISTS, SET AN INDEX CONTROLLER
		bnmr.vars.currVid = 0;

		// SET VIDEO OPTIONS
		bnmr.vars.controls == 'true' ? bnmr.fns.createControls() : null;
		bnmr.vars.poster != null ? bnmr.vars.vidEl.setAttribute('poster', bnmr.vars.poster) : null;
		bnmr.els.vidEl.setAttribute('width', bnmr.vars.width);
		bnmr.els.vidEl.setAttribute('height', bnmr.vars.height);

		// INITIALIZE VIDEO
		bnmr.els.locationElement.appendChild(bnmr.els.vidEl);
		bnmr.vars.playlist == null ? bnmr.els.vidEl.src = bnmr.vars.file : (bnmr.els.vidEl.src = bnmr.vars.playlist[bnmr.vars.currVid], bnmr.fns.createPlaylist());
		bnmr.vars.muted == 'true' ? _this.mute() : _this.unmute();
		bnmr.vars.autoplay == 'true' ? _this.play() : null;

		bnmr.fns.eventListeners();
	}

	bnmr.fns.createControls = function () {
		bnmr.els.controls = document.createElement('div');
		bnmr.fns.addClass(bnmr.els.controls, 'controls_' + bnmr.vars.rand);
		document.querySelector(bnmr.vars.location).appendChild(bnmr.els.controls);

			bnmr.els.btnPlayPause = document.createElement('div');
			bnmr.fns.addClass(bnmr.els.btnPlayPause, 'btnPlayPause_' + bnmr.vars.rand);
			bnmr.els.controls.appendChild(bnmr.els.btnPlayPause);

				bnmr.els.btnPlay = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.btnPlay, 'btnPlay_' + bnmr.vars.rand);
				bnmr.els.btnPlayPause.appendChild(bnmr.els.btnPlay);

					bnmr.els.icnPlay = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnPlay, 'icnPlay_' + bnmr.vars.rand);
					bnmr.els.btnPlay.appendChild(bnmr.els.icnPlay);

				bnmr.els.btnPause = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.btnPause, 'btnPause_' + bnmr.vars.rand);
				bnmr.els.btnPlayPause.appendChild(bnmr.els.btnPause);

					bnmr.els.icnPauseLeft = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnPauseLeft, 'icnPauseLeft_' + bnmr.vars.rand);
					bnmr.els.btnPause.appendChild(bnmr.els.icnPauseLeft);

					bnmr.els.icnPauseRight = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnPauseRight, 'icnPauseRight_' + bnmr.vars.rand);
					bnmr.els.btnPause.appendChild(bnmr.els.icnPauseRight);

			bnmr.vars.autoplay == 'true' ? bnmr.fns.addClass(bnmr.els.btnPause, 'visible') : bnmr.fns.addClass(bnmr.els.btnPlay, 'visible');

			bnmr.els.progressBar = document.createElement('div');
			bnmr.fns.addClass(bnmr.els.progressBar, 'progressBar_' + bnmr.vars.rand);
			bnmr.els.controls.appendChild(bnmr.els.progressBar);

				bnmr.els.progressPlayed = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.progressPlayed, 'progressPlayed_' + bnmr.vars.rand);
				bnmr.els.progressBar.appendChild(bnmr.els.progressPlayed);

			bnmr.els.btnMuteUnmute = document.createElement('div');
			bnmr.fns.addClass(bnmr.els.btnMuteUnmute, 'btnMuteUnmute_' + bnmr.vars.rand);
			bnmr.els.controls.appendChild(bnmr.els.btnMuteUnmute);

				bnmr.els.icnSpeaker = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnSpeaker, 'icnSpeaker_' + bnmr.vars.rand);
				bnmr.els.btnMuteUnmute.appendChild(bnmr.els.icnSpeaker);

					bnmr.els.icnBox = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnBox, 'icnBox_' + bnmr.vars.rand);
					bnmr.els.icnSpeaker.appendChild(bnmr.els.icnBox);

					bnmr.els.icnPolygon = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnPolygon, 'icnPolygon_' + bnmr.vars.rand);
					bnmr.els.icnSpeaker.appendChild(bnmr.els.icnPolygon);

				bnmr.els.icnSound = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnSound, 'icnSound_' + bnmr.vars.rand);
				bnmr.els.btnMuteUnmute.appendChild(bnmr.els.icnSound);

					bnmr.els.icnSemiCircleSm = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnSemiCircleSm, 'icnSemiCircleSm_' + bnmr.vars.rand);
					bnmr.els.icnSound.appendChild(bnmr.els.icnSemiCircleSm);

					bnmr.els.icnSemiCircleMd = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnSemiCircleMd, 'icnSemiCircleMd_' + bnmr.vars.rand);
					bnmr.els.icnSound.appendChild(bnmr.els.icnSemiCircleMd);

					bnmr.els.icnSemiCircleLg = document.createElement('div');
					bnmr.fns.addClass(bnmr.els.icnSemiCircleLg, 'icnSemiCircleLg_' + bnmr.vars.rand);
					bnmr.els.icnSound.appendChild(bnmr.els.icnSemiCircleLg);

			bnmr.vars.muted == 'true' ? bnmr.fns.removeClass(bnmr.els.icnSound, 'visible') : bnmr.fns.addClass(bnmr.els.icnSound, 'visible');
	}

	bnmr.fns.createPlaylist = function () {
		if (bnmr.vars.controls == 'true') {
			bnmr.els.btnNext = document.createElement('div');
			bnmr.fns.addClass(bnmr.els.btnNext, 'btnNext_' + bnmr.vars.rand);
			bnmr.els.controls.appendChild(bnmr.els.btnNext);

				bnmr.els.icnNext1 = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnNext1, 'icnNext1_' + bnmr.vars.rand);
				bnmr.els.btnNext.appendChild(bnmr.els.icnNext1);

				bnmr.els.icnNext2 = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnNext2, 'icnNext2_' + bnmr.vars.rand);
				bnmr.els.btnNext.appendChild(bnmr.els.icnNext2);

			bnmr.els.btnPrevious = document.createElement('div');
			bnmr.fns.addClass(bnmr.els.btnPrevious, 'btnPrevious_' + bnmr.vars.rand);
			bnmr.els.controls.appendChild(bnmr.els.btnPrevious);

				bnmr.els.icnPrevious1 = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnPrevious1, 'icnPrevious1_' + bnmr.vars.rand);
				bnmr.els.btnPrevious.appendChild(bnmr.els.icnPrevious1);

				bnmr.els.icnPrevious2 = document.createElement('div');
				bnmr.fns.addClass(bnmr.els.icnPrevious2, 'icnPrevious2_' + bnmr.vars.rand);
				bnmr.els.btnPrevious.appendChild(bnmr.els.icnPrevious2);
		}
	}

	bnmr.fns.onVideoTimeUpdate = function () {
		bnmr.vars.cur = bnmr.els.vidEl.currentTime;
		bnmr.vars.dur = bnmr.els.vidEl.duration;
		bnmr.vars.newWidth = (bnmr.vars.cur / bnmr.vars.dur) * 100;
		bnmr.els.progressPlayed.style.width = bnmr.vars.newWidth + '%';
	}

	bnmr.fns.onVideoEnded = function () {
		if (bnmr.vars.playlist) {
			_this.next();
		} else {
			if (bnmr.vars.loop == 'true') {
				_this.replay();
			} else {
				return;
			}
		}
	}

	bnmr.fns.seekHandler = function (e) {
		bnmr.vars.clickPos = e.offsetX;
		bnmr.vars.durWidth = parseInt(window.getComputedStyle(bnmr.els.progressBar).width);
		bnmr.vars.seekTo = bnmr.vars.clickPos / bnmr.vars.durWidth;
		bnmr.vars.seekPerc = bnmr.vars.seekTo * 100;

		bnmr.els.vidEl.currentTime = bnmr.els.vidEl.duration * bnmr.vars.seekTo;
		bnmr.els.progressPlayed.style.width = bnmr.vars.seekPerc + '%';
	}

	bnmr.fns.eventListeners = function () {
		if (bnmr.vars.controls == 'true') {
			bnmr.els.btnPlay.onclick = _this.play;
			bnmr.els.btnPause.onclick = _this.pause;
			bnmr.els.btnMuteUnmute.onclick = _this.volume;
			bnmr.els.vidEl.ontimeupdate = bnmr.fns.onVideoTimeUpdate;
			bnmr.els.progressBar.onclick = bnmr.fns.seekHandler;

			if (bnmr.vars.playlist) {
				bnmr.els.btnNext.onclick = _this.next;
				bnmr.els.btnPrevious.onclick = _this.previous;
			}
		}

		bnmr.els.vidEl.onended = bnmr.fns.onVideoEnded;
	}


	//  PUBLIC FUNCTIONS
	_this.setup = function (options, loc) {
		// INITIALIZE OPTIONS
		switch (typeof options) {
			case 'object':
				bnmr.vars.autoplay = options.autoplay || true;
				bnmr.vars.controls = options.controls || true;
				bnmr.vars.file = options.file || 'video.mp4';
				bnmr.vars.height = options.height || 'auto';
				bnmr.vars.location = options.location || 'body';	
				bnmr.vars.loop = options.loop || true;
				bnmr.vars.playlist = options.playlist || null;
				bnmr.vars.poster = options.poster || null;
				bnmr.vars.muted = options.muted || false;
				bnmr.vars.width = options.width || 'auto';
			break;

			case 'string':
				bnmr.vars.autoplay = true;
				bnmr.vars.controls = true;
				bnmr.vars.file = options || 'video.mp4';
				bnmr.vars.height = 360;
				bnmr.vars.location = loc || 'body';	
				bnmr.vars.loop = true;
				bnmr.vars.muted = false;
				bnmr.vars.poster = options.poster || null;
				bnmr.vars.width = 640;
			break;
		}

		bnmr.fns.initPlayer();
	}

	_this.play = function () {
		bnmr.els.vidEl.play();
		bnmr.vars.playing = true;

		bnmr.fns.addClass(bnmr.els.btnPause, 'visible');
		bnmr.fns.removeClass(bnmr.els.btnPlay, 'visible');
	}

	_this.pause = function () {
		bnmr.els.vidEl.pause();
		bnmr.vars.playing = false;	

		bnmr.fns.addClass(bnmr.els.btnPlay, 'visible');
		bnmr.fns.removeClass(bnmr.els.btnPause, 'visible');
	}

	_this.volume = function () {
		if (bnmr.vars.muted == true) {
			_this.unmute();
		} else {
			_this.mute();
		}
	}

	_this.mute = function () {
			bnmr.els.vidEl.volume = 0;
			bnmr.fns.removeClass(bnmr.els.icnSound, 'visible');
			bnmr.vars.muted = true;
	}

	_this.unmute = function () {
			bnmr.els.vidEl.volume = 1;
			bnmr.fns.addClass(bnmr.els.icnSound, 'visible');
			bnmr.vars.muted = false;
	}

	_this.next = function () {
		if (bnmr.vars.currVid < bnmr.vars.playlist.length - 1) {	
			bnmr.vars.currVid++;
		} else if (bnmr.vars.loop == 'true') {
			bnmr.vars.currVid = 0;
		} else {
			return;
		}
		
		bnmr.els.vidEl.src = bnmr.vars.playlist[bnmr.vars.currVid];
		bnmr.els.vidEl.load();
		_this.play();
	}

	_this.previous = function () {
		if (bnmr.vars.currVid > 0) {	
			bnmr.vars.currVid--;
		} else if (bnmr.vars.loop == 'true') {
			bnmr.vars.currVid = bnmr.vars.playlist.length - 1;
		} else {
			return;
		}
		
		bnmr.els.vidEl.src = bnmr.vars.playlist[bnmr.vars.currVid];
		bnmr.els.vidEl.load();
		_this.play();
	}

	_this.replay = function () {
		bnmr.els.vidEl.load();
		bnmr.els.vidEl.play();
	}
}