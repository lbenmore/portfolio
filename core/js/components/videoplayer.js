var VideoPlayer = function (options) {
  var _this = this;

  if (!options) {
    console.error('No video player configuration provided.');
    return;
  } else if (typeof options != 'object') {
    console.error('Incorrect video player configuration provided.');
    return;
  }

  try {
    _this.target = options.target;
    _this.playlist = options.playlist || [options.video];
    _this.controls = (typeof options.controls == 'boolean') ? options.controls : true;
    _this.muted = (typeof options.muted == 'boolean') ? options.muted : false;
    _this.autoplay = (typeof options.autoplay == 'boolean') ? options.autoplay : true;
    _this.loop = (typeof options.loop == 'boolean') ? options.loop : true;
    _this.active = 0;
    _this.color = options.color || null;
  } catch (e) {
    console.error('Incorrect video player configuration provided...');
    console.error(e.message);
  }

  function loadVideo (path, play) {
    _this.elements.video.setAttribute('src', path);
    _this.elements.video.load();
    if (play) _this.play();
  }

  _this.updateVolume = function (e) {
    _this.unmute();
  };

  _this.unmute = function () {
    _this.elements.video.muted = false;
  };

  _this.mute = function () {
    _this.elements.video.muted = true;
  };

  _this.seek = function (e) {
    var
    dur = _this.elements.video.duration,
    totalWid = parseFloat(e.currentTarget.getBoundingClientRect().width),
    mouseX = e.layerX,
    perc = (mouseX / totalWid),
    newTime = dur * perc;

    _this.elements.video.currentTime = newTime;
  };

  _this.previous = function () {
    _this.active = (_this.active > 0) ? _this.active - 1 : _this.playlist.length - 1;
    loadVideo(_this.playlist[_this.active], true);
  };

  _this.next = function () {
    _this.active = (_this.active < _this.playlist.length - 1) ? _this.active + 1 : 0;
    loadVideo(_this.playlist[_this.active], true);
  };

  _this.pause = function () {
    _this.elements.video.pause();
  };

  _this.play = function () {
    _this.elements.video.play();
    _this.elements.btnReplay.style.display = 'none';
  };

  function toggleMute () {
    if (_this.elements.video.muted) {
      _this.unmute();
    } else {
      _this.mute();
    }
  }

  function togglePlay () {
    if (_this.elements.video.paused) {
      _this.play();
    } else {
      _this.pause();
    }
  }

  function handleVideoEnd () {
    switch (true) {
      case _this.loop:
      case _this.active < _this.playlist.length - 1:
        _this.next();
      break;

      default:
        _this.elements.btnReplay.style.display = 'block';
      break;
    }
  }

  function handleTimeUpdate (e) {
    var
    cur = _this.elements.video.currentTime,
    dur = _this.elements.video.duration,
    perc = cur / dur * 100;

    _this.elements.progressPlayed.style.width = perc + '%';
  }

  function setDataAttributes (e) {
    _this.elements.video.dataset.paused = _this.elements.video.paused;
    _this.elements.video.dataset.playlist = _this.playlist.length > 1;

    if (_this.elements.video.muted || _this.elements.video.volume == 0) {
      _this.elements.video.dataset.muted = 'true';
    } else {
      _this.elements.video.dataset.muted = 'false';
    }
  }

  function eventListeners () {
    _this.elements.video.addEventListener('playing', setDataAttributes);
    _this.elements.video.addEventListener('pause', setDataAttributes);
    _this.elements.video.addEventListener('volumechange', setDataAttributes);
    _this.elements.video.addEventListener('ended', handleVideoEnd);
    _this.elements.btnReplay.addEventListener('click', _this.next);
    if (_this.controls) {
      _this.elements.video.addEventListener('timeupdate', handleTimeUpdate);
      _this.elements.progressBar.addEventListener('click', _this.seek);
      _this.elements.btnPlayState.addEventListener('click', togglePlay);
      _this.elements.btnPrevious.addEventListener('click', _this.previous);
      _this.elements.btnNext.addEventListener('click', _this.next);
      _this.elements.btnVolumeState.addEventListener('click', toggleMute);
      _this.elements.inputVolume.addEventListener('input', function (e) {
        _this.elements.video.volume = (1 - e.target.value).toFixed(2);
      })
    }
  }

  function init () {
    _this.elements = {};

    _this.elements.container = _this.target;
    _this.elements.video = document.createElement('video');
    _this.elements.btnReplay = document.createElement('div');

    _this.elements.container.classList.add('videoPlayer');
    _this.elements.container.innerHTML = '';

    _this.elements.video.classList.add('video');
    _this.elements.video.setAttribute('muted', 'true');
    _this.elements.container.appendChild(_this.elements.video);

    _this.elements.btnReplay.classList.add('btnReplay');
    _this.elements.container.appendChild(_this.elements.btnReplay);

    if (_this.controls) {
      _this.elements.controls = document.createElement('div');
      _this.elements.btnPlayState = document.createElement('div');
      _this.elements.btnPrevious = document.createElement('div');
      _this.elements.progress = document.createElement('div');
      _this.elements.progressBar = document.createElement('div');
      _this.elements.progressPlayed = document.createElement('div');
      _this.elements.btnVolumeState = document.createElement('div');
      _this.elements.inputVolume = document.createElement('input');
      _this.elements.btnNext = document.createElement('div');

      _this.elements.controls.classList.add('controls');
      _this.elements.container.appendChild(_this.elements.controls);

      _this.elements.btnPlayState.classList.add('btn');
      _this.elements.btnPlayState.classList.add('btnPlayState');
      _this.elements.controls.appendChild(_this.elements.btnPlayState);

      _this.elements.btnPrevious.classList.add('btn');
      _this.elements.btnPrevious.classList.add('btnPrevious');
      _this.elements.controls.appendChild(_this.elements.btnPrevious);

      _this.elements.progress.classList.add('progress');
      _this.elements.controls.appendChild(_this.elements.progress);

      _this.elements.progressBar.classList.add('progressBar');
      _this.elements.progress.appendChild(_this.elements.progressBar);

      _this.elements.progressPlayed.classList.add('progressPlayed');
      _this.elements.progressBar.appendChild(_this.elements.progressPlayed);

      _this.elements.btnNext.classList.add('btn');
      _this.elements.btnNext.classList.add('btnNext');
      _this.elements.controls.appendChild(_this.elements.btnNext);

      _this.elements.btnVolumeState.classList.add('btn');
      _this.elements.btnVolumeState.classList.add('btnVolumeState');
      _this.elements.btnVolumeState.appendChild(document.createElement('span'));
      _this.elements.controls.appendChild(_this.elements.btnVolumeState);

      _this.elements.inputVolume.classList.add('inputVolume');
      _this.elements.inputVolume.setAttribute('type', 'range');
      _this.elements.inputVolume.setAttribute('value', '0');
      _this.elements.inputVolume.setAttribute('min', '0');
      _this.elements.inputVolume.setAttribute('max', '1');
      _this.elements.inputVolume.setAttribute('step', '0.05');
      _this.elements.controls.appendChild(_this.elements.inputVolume);

      if (_this.color) {
        _this.elements.controls.style.color = _this.color;
        _this.elements.btnReplay.style.color = _this.color;
      }
    }

    setDataAttributes();
    eventListeners();
    loadVideo(_this.playlist[_this.active], _this.autoplay);
  }

  init();
}
