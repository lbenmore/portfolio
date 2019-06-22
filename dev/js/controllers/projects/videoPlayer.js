core.controllers.VideoPlayer = () => {
  let
  player;

  const
  togglePlayerType = (e) => {
    switch ($$('.vplayer').dataset.vType) {
      case 'playlist':
        videoPlayer = new VideoPlayer({
          target: $$('.vplayer'),
          video: 'http://lisabenmore.com/video/Need_to_Change_-_Landon_Tewers.mp4',
          muted: true,
          color: '#ff0'
        });

        e.target.dataset.vType = 'Single';
        $$('.vplayer').dataset.vType = 'single';
      break;

      case 'single':
        videoPlayer = new VideoPlayer({
          target: $$('.vplayer'),
          playlist: [
            'http://lisabenmore.com/video/onething.mp4',
            'http://lisabenmore.com/video/fromeden.mp4',
            'http://lisabenmore.com/video/sedated.mp4'
          ],
          muted: true,
          color: '#0f8'
        });

                e.target.dataset.vType = 'Playlist';
        $$('.vplayer').dataset.vType = 'playlist';
      break;
    }
  },

  eventListeners = () => {
    $$('.options__button--toggle').on('tap', togglePlayerType);
  },

  initFns = () => {
    player = new VideoPlayer({
      target: $$('.vplayer'),
      playlist: [
        'http://lisabenmore.com/video/onething.mp4',
        'http://lisabenmore.com/video/fromeden.mp4',
        'http://lisabenmore.com/video/sedated.mp4'
      ],
      color: '#80f'
    });

    $$('.vplayer').dataset.vType = 'playlist';

    eventListeners();
  };
  
  initFns();

	/*
  if ($$.loaded) {
    initVideoFns();
  } else {
    addEventListener('LOAD_EVENT', initVideoFns);
  }
  */
};
