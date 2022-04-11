core.controllers.VideoPlayer = function () {
  var
  videoPlayer,
  max = 99;


  this.externalControls = function (control) {
    videoPlayer[control]();
  };

  this.updateVideoPlayer = function (type) {
    switch (type) {
      case 'single':
        videoPlayer = new VideoPlayer({
          target: $$('.bnmr-video-player'),
          video: 'http://lisabenmore.com/video/Need_to_Change_-_Landon_Tewers.mp4',
          muted: true,
          color: '#ff0'
        });

        for (var i = 0; i < $$('.playlistOnly').length; i++) {
          $$('.playlistOnly')[i].setAttribute('disabled', 'true');
        }
      break;

      case 'playlist':
        videoPlayer = new VideoPlayer({
          target: $$('.bnmr-video-player'),
          playlist: [
            'http://lisabenmore.com/video/onething.mp4',
            'http://lisabenmore.com/video/fromeden.mp4',
            'http://lisabenmore.com/video/sedated.mp4'
          ],
          muted: true,
          color: '#0f8'
        });

        for (var i = 0; i < $$('.playlistOnly').length; i++) {
          $$('.playlistOnly')[i].removeAttribute('disabled');
        }
      break;
    }
  };

  function initVideoPlayer () {
    /**
     *
     * VIDEO PLAYER PARAMETERS
     * target (required) HTML Node
     * video (required [unless playlist not provided]) String of video path URL. no default.
     * playlist (optional) Array of video path URLs. default is video.
     * autoplay (optional) Boolean of whether video plays on load. default is true
     * controls (optional) Boolean of whether controls are present. default is true
     * loop (optional) Boolean of whether video replays when complete. default is true
     * muted (optional) Boolean of video starts muted. default is false
     * color (optional) String CSS color value for controls. default is natural color from cascade.
     *
     */

    videoPlayer = new VideoPlayer({
      target: $$('.bnmr-video-player'),
      playlist: [
        'http://lisabenmore.com/video/onething.mp4',
        'http://lisabenmore.com/video/fromeden.mp4',
        'http://lisabenmore.com/video/sedated.mp4'
      ],
      color: '#80f'
    });
  }

  function load () {
    if ('VideoPlayer' in window) {
      initVideoPlayer();
    } else {
      $$.log('video player load attempt: ' + (99 - --max));
      if (max) setTimeout(load, 100);
    }
  }

  load();
};
