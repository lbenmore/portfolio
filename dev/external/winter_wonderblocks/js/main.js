import $$ from './com/dom.js';
import Blocks from './blocks/game.js';
import Snowflake from './snow/snowflake.js';

;(function (win, doc) {
  function clearSnow () {
    win.snowflakes.forEach(x => x.destroy());
    $$('.background__snow').innerHTML = '';
    snowflakes.length = 0;
  }
  
  function initSnow () {
    for (let i = 0; i < win.innerWidth / 20; i++) {
      snowflakes.push(new Snowflake($$('.background__snow'), {
        color: 'white'
      }));
    }
  }
  
  function toggleSnow (evt) {
    const { checked } = evt.target;
    switch (checked) {
      case true:
        initSnow();
        break;
      
      case false:
        clearSnow();
      
    }
  }
  
  function toggleControls (evt) {
    const { checked } = evt.target;
    win.onScreenControls = !!checked;
  }
  
  function forceControl (keyCode) {
    win.game.controls({ keyCode });
  }
  
  function gameSelector () {
    return `.game${win.onScreenControls ? ', .controls' : ''}`;
  }
  
  function onGameOver () {
    $$(gameSelector()).animate({ opacity: '0' }, () => {
      $$(gameSelector()).css('display', 'none');
      
      $$('.info__start, .info__pause').css('display', 'none');
      $$('.info__end').css('display', 'block');
      $$('.info').css('display', 'inline-block', () => {
        $$('.info').animate({ opacity: '1' });
      });
    });
    
    win.game = null;
    $$('.game').innerHTML = '';
    $$('.header__btn--togglePlay').removeAttribute('data-is-playing');
  }
  
  function pauseGame (callback) {
    win.game.stop();
    $$('.header__btn--togglePlay').dataset.isPlaying = 'false';
    
    $$(gameSelector()).animate({ opacity: '0' }, () => {
      $$(gameSelector()).css({ display: 'none' });
      
      $$('.info__start, .info__end').css({ display: 'none' })
      $$('.info__pause').css({ display: 'block' });
      
      $$('.info').css({ display: 'inline-block' }, () => {
        $$('.info').animate({ opacity: '1' }, () => {
          callback && typeof callback === 'function' && callback();
        });
      });
    });
  }
  
  function playGame (callback) {
    $$('.header__btn--togglePlay').dataset.isPlaying = 'true';
    
    $$('.info').animate({ opacity: '0' }, () => {
      $$('.info').css({ display: 'none' });
      
      $$(gameSelector()).css({ display: 'inline-block' }, () => {
        $$(gameSelector()).animate({ opacity: '1' }, () => {
          callback && typeof callback === 'function' && callback();
          win.game && !win.game.playing && win.game.start();
        });
      });
    });
  }
  
  function startGame () {
    win.game = null;
    playGame(() => {
      if (win.game && !win.game.playing) win.game.start();
      else if (!win.game) {
        win.game = new Blocks($$('.game'), {
          colors: [
            '#f00',
            '#f04',
            '#c00',
            '#800',
            '#0f0',
            '#0f4',
            '#0c0',
            '#080'
          ],
          speed: 500
        });
        win.game.events.addEventListener('blocks.gameover', onGameOver);
      }
    });
  }
  
  function toggleGamePlay (evt) {
    win.game.playing ? pauseGame() : playGame();
  }
  
  function stylize () {
    doc.body.style.setProperty('--vh', `${win.innerHeight / 100}px`);
    
    if (win.innerWidth > win.innerHeight) {
      doc.body.style.setProperty('--game-size', `calc((100 * var(--vh)) - var(--header-height) - (var(--gutter) * 2))`);
    } else {
      doc.body.style.setProperty('--game-size', `calc(100vw - (var(--gutter) * 2))`);
    }
  }
  
  function eventListeners () {
    $$(win).on('resize', stylize);
    
    $$('.info__btn--start').on('click', startGame);
    $$('.info__btn--resume').on('click', playGame);
    $$('.header__btn--togglePlay').on('click', toggleGamePlay);
    
    $$('#info__toggle--snow').on('change', toggleSnow);
    $$('#info__toggle--controls').on('change', toggleControls);
    
    $$('.controls__arrow--left').on('click', forceControl.bind(null, 37));
    $$('.controls__arrow--right').on('click', forceControl.bind(null, 39));
    $$('.controls__rotate').on('click', forceControl.bind(null, 16));
  }
  
  function initFns () {
    win.game = null;
    win.snowflakes = [];
    
    stylize();
    eventListeners();
    initSnow();
  }
  
  doc.readyState === 'complete'
    ? initFns()
    : $$(doc).on('readystatechange', () => (doc.readyState === 'complete' && initFns()));
})(window, window.document);