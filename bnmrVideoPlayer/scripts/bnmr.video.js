// JavaScript Document

class VideoPlayer {
  constructor (options) {
    const evalBool = (value) => {
      switch (typeof value) {
        case 'boolean':
          return value;
        break;

        case 'string':
          if (value.toLowerCase() == 'true') {
            return true;
          } else {
            return false;
          }
        break;

        case 'object':
          return true;
        break;
      }
    };

    let
    type = options.type || 'mp4',
    path = options.path || null,
    location = document.querySelector(options.location) || document.body,
    autoplay = evalBool(options.autoplay) || true,
    width = options.width || null,
    height = options.height || null;

    width = !width ? 'auto' : isNaN(options.width) ? options.width : `${options.width}px`;
    height = !height ? 'auto' : isNaN(options.width) ? options.height : `${options.height}px`;

    this.videoRegion = document.createElement('div');
    this.video = document.createElement('video');
    this.controls = evalBool(options.controls) || true;
    this.loop = evalBool(options.loop) || false;
    this.muted = evalBool(options.muted) || false;
    this.label = options.label || 'bnmrVideoPlayer';

    this.videos = typeof path == 'object' ? path : [path];
    this.currentVideo = 0;

    this.videoRegion.classList.add(`${this.label}__videoRegion`);
    this.videoRegion.style.width = width;
    this.videoRegion.style.height = height;

    this.video.classList.add(`${this.label}__video`);
    this.video.setAttribute('src', this.videos[this.currentVideo]);

    switch (type) {
      case 'mp4':
        this.video.setAttribute('type', 'video/mp4');
      break;

      case 'ogv':
        this.video.setAttribute('type', 'video/ogg');
      break;

      case 'webm':
        this.video.setAttribute('type', 'video/webm');
      break;
    }

    this.videoRegion.appendChild(this.video);
    location.appendChild(this.videoRegion);

    this.video.load();

    this.controls ? this.initControls() : null;
    this.muted ? this.mute() : this.unmute();
    autoplay ? this.play() : this.pause();

    this.eventListeners();
  }

  play () {
    this.video.play();

    if (this.controls) {
      this.btnPlayState.classList.add('playing');
      this.btnPlayState.classList.remove('paused');
    }
  }

  pause () {
    this.video.pause();

    if (this.controls) {
      this.btnPlayState.classList.add('paused');
      this.btnPlayState.classList.remove('playing');
    }
  }

  togglePlay () {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  mute () {
    this.video.volume = 0;

    if (this.controls) {
      this.btnVolumeState.classList.add('unmuted');
      this.btnVolumeState.classList.remove('muted');

      if (this.inpVolume.getElementsByTagName('input').length) {
        this.inpVolume.getElementsByTagName('input')[0].value = 0;
      }
    }
  }

  unmute () {
    this.video.volume = 1;

    if (this.controls) {
      this.btnVolumeState.classList.add('muted');
      this.btnVolumeState.classList.remove('unmuted');

      if (this.inpVolume.getElementsByTagName('input').length) {
        this.inpVolume.getElementsByTagName('input')[0].value = 1;
      }
    }
  }

  toggleMute () {
    if (this.video.volume) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  updateVolume (e) {
    this.video.volume = e.target.value;
  }

  setProgress (e) {
    let
    cur = this.video.currentTime,
    dur = this.video.duration,
    perc = Math.floor(cur / dur * 100);

    this.progressBar.style.setProperty('--prog', `${perc}%`);
  }

  seek (e) {
    let
    setPoint = e.layerX,
    fullWidth = parseInt(window.getComputedStyle(this.progressBar).width),
    perc = setPoint / fullWidth,
    dur = this.video.duration;

    this.video.currentTime = dur * perc;
  }

  next (e) {
    if (this.currentVideo < this.videos.length - 1) {
      this.currentVideo++;
    } else {
      if (!this.loop && e.type != 'click') {
        this.pause();
        return;
      }

      this.currentVideo = 0;
    }

    this.video.src = this.videos[this.currentVideo];
    this.play();
  }

  previous () {
    if (this.currentVideo > 0) {
      this.currentVideo--;
    } else {
      this.currentVideo = this.videos.length - 1;
    }

    this.video.src = this.videos[this.currentVideo];
    this.video.load();
    this.video.play();
  }

  controlsEventListeners () {
    this.btnPlayState.addEventListener('click', this.togglePlay.bind(this));
    this.btnPrevious.addEventListener('click', this.previous.bind(this));
    this.progressBar.addEventListener('click', this.seek.bind(this));
    this.btnNext.addEventListener('click', this.next.bind(this));
    this.btnVolumeState.addEventListener('click', this.toggleMute.bind(this));
    this.inpVolume.querySelector('input').addEventListener('change', this.updateVolume.bind(this));
  }

  initControls () {
    const
    createChildren = (arr, target, label) => {
      for (let el of arr) {
        let _this = document.createElement('div');
        _this.className = `${label}__${el.name}`;
        target.appendChild(_this);

        this[el.name] = _this;

        if (el.content) {
          createChildren(el.content, _this, this.label);
        }
      }
    };

    let
    els = [
      {
        name: 'controls',
        content: [
          {
            name: 'btnPlayState'
          },
          {
            name: 'btnPrevious'
          },
          {
            name: 'progressBar'
          },
          {
            name: 'btnNext'
          },
          {
            name: 'btnVolumeState',
            content: [
              {
                name: 'inpVolume'
              }
            ]
          }
        ]
      }
    ],

    childrenLoad,
    inp;

    createChildren(els, this.videoRegion, this.label);

    childrenLoad = setInterval(() => {
      if (this.inpVolume) {
        clearInterval(childrenLoad);

        inp = document.createElement('input');
        inp.setAttribute('type', 'range');
        inp.setAttribute('min', '0');
        inp.setAttribute('max', '1');
        inp.setAttribute('step', '0.05');

        this.muted ? inp.setAttribute('value', '0') : inp.setAttribute('value', '1');
        this.inpVolume.appendChild(inp);

        if (this.videos.length < 2) {
          this.btnNext.classList.add('hide');
          this.btnPrevious.classList.add('hide');
        }

        this.controlsEventListeners();
      }
    });
  }

  eventListeners () {
    if (this.controls) this.video.ontimeupdate = this.setProgress.bind(this);
    this.video.addEventListener('ended', this.next.bind(this));
  }
}

$$.VideoPlayer = VideoPlayer;
