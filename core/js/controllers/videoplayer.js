var
max = 99,
VideoPlayer = VideoPlayer || null,
player,

externalControls = function (control) {
  player[control]();
}

updateVideoPlayer = function (type) {
  switch (type) {
    case 'single':
      player = new VideoPlayer({
        target: $$('.bnmr-video-player'),
        video: 'http://lisabenmore.com/video/Need_to_Change_-_Landon_Tewers.mp4',
        muted: true,
        loop: true,
        color: '#80f'
      });

      for (var i = 0; i < $$('.playlistOnly').length; i++) {
        $$('.playlistOnly')[i].setAttribute('disabled', 'true');
      }
    break;

    case 'playlist':
      player = new VideoPlayer({
        target: $$('.bnmr-video-player'),
        playlist: [
          'http://lisabenmore.com/video/onething.mp4',
          'http://lisabenmore.com/video/fromeden.mp4',
          'http://lisabenmore.com/video/sedated.mp4'
        ],
        muted: true,
        loop: true,
        color: '#80f'
      });

      for (var i = 0; i < $$('.playlistOnly').length; i++) {
        $$('.playlistOnly')[i].removeAttribute('disabled');
      }
    break;
  }
}

initVideoPlayer = function () {
    if (!VideoPlayer) {
      if (max) {
        setTimeout(initVideoPlayer, 100);
        --max;
         $$.log('bnmr Video Player Retry Load Attempt: ' + (99 - max));
      }
    } else {
      player = new VideoPlayer({
        target: $$('.bnmr-video-player'),
        // video: 'http://lisabenmore.com/video/Need_to_Change_-_Landon_Tewers.mp4',
        playlist: [
          'http://lisabenmore.com/video/onething.mp4',
          'http://lisabenmore.com/video/fromeden.mp4',
          'http://lisabenmore.com/video/sedated.mp4'
        ],
        muted: true,
        loop: true,
        color: '#80f'
      });
    }
},

initFns = function () {
  initVideoPlayer();
};

initFns();
