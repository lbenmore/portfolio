core.controllers.WhackAMouse = () => {
  let
  moles = [],
  score,
  timer,
  level,
  multiplier,
  popAMole;

  const
  responsify = () => {
    let contWd = parseInt(window.getComputedStyle(document.querySelector('.game')).width),
        contHt = parseInt(window.getComputedStyle(document.querySelector('.game')).height),
        contRt = contWd / contHt,
        winWd = window.innerWidth,
        winHt = window.innerHeight,
        winRt = winWd / winHt;

    // if (contWd > winWd || contHt > winHt) {
      if (winRt > contRt) {
        document.querySelector('.game').style.transform = `translate(-50%, -50%) scale(${winHt / contHt})`;
      } else {
        document.querySelector('.game').style.transform = `translate(-50%, -50%) scale(${winWd / contWd})`;
      }
    // } else {
    //   document.querySelector('.game').style.transform = 'translate(-50%, -50%)';
    // }
  },

  eventListeners = () => {
    // window.onresize = responsify;
    document.querySelector('.btn--replay').onclick = initGameplay;
  },

  newMole = () => {
    let rand = Math.floor(Math.random() * document.querySelectorAll('.burrow').length);
    let mole = new Mole(document.querySelectorAll('.burrow')[rand]);
    moles.push(mole);
  },

  gameOver = () => {
    clearInterval(popAMole);
    document.querySelector('.btn--replay').style.display = 'block';
    for (let mole of moles) {
      mole.toBad();
    }
  },

  levelUp = () => {
    level++;
    timer = timer * multiplier;
    document.body.style.setProperty('--timer', `${timer}ms`);

    clearInterval(popAMole);

    popAMole = setInterval(newMole, Math.pow(multiplier, level) * 2000);
  },

  updateScore = () => {
    score++;
    document.querySelector('.score').innerHTML = score;

    score % 5 == 0 ? levelUp() : null;
  };

  class Mole {
    constructor (target) {
      this.target = target;
      this.moleId = 'mole__' + new Date().getTime();

      this.mole = document.createElement('div');
      this.mole.classList.add('burrow__mole');
      this.mole.classList.add('good');
      this.mole.addEventListener('click', this.whack.bind(this));
      this.target.insertBefore(this.mole, this.target.children[0]);

      setTimeout(() => {
        this.mole.classList.add('active');
      }, 50);

      this.warningTimeout = setTimeout(() => {
        this.toWarning();
      }, timer);

      this.finalCountdown = setTimeout(() => {
        gameOver();
      }, timer * 2);
    };

    toWarning () {
      this.mole.classList.remove('good');
      this.mole.classList.add('warning');
    };

    toBad () {
      this.mole.classList.remove('warning');
      this.mole.classList.add('bad');
    };

    remove () {
      clearTimeout(this.warningTimeout);
      clearTimeout(this.finalCountdown);
      this.mole.parentNode.removeChild(this.mole);

      for (let mole of moles) {
        if (mole.moleId == this.moleId) {
          moles.splice(moles.indexOf(mole), 1);
        }
      }
    }

    whack () {
      clearTimeout(this.finalCountdown);
      this.mole.classList.remove('active');
      setTimeout(() => {
        this.remove();
      }, 500);

      updateScore();
    };
  };

  const
  initGameplay = () => {
    if (moles.length > 0) {
      let tempMolesLength = moles.length - 1;
      for (let i = tempMolesLength; i >= 0; i--) {
        moles[i].remove();
      }
    }

    score = 0;
    timer = 3000;
    level = 1;
    multiplier = 0.8;

    document.body.style.setProperty('--timer', `${timer}ms`);

    document.querySelector('.btn--replay').style.display = 'none';
    document.querySelector('.score').innerHTML = score;

    popAMole = setInterval(newMole, Math.pow(multiplier, level) * 2000);
  },

  initWhackAMouseFns = () => {
    eventListeners();
    // responsify();
    initGameplay();

    addEventListener('hashchange', () => { $$.log('leaving');
      clearInterval(popAMole);
      for (const mole of moles) {
        clearTimeout(mole.warningTimeout);
        clearTimeout(mole.finalCountdown);
      }
    }, {once: true});
  };

  if ($$.loaded) {
    initWhackAMouseFns();
  } else {
    addEventListener('LOAD_EVENT', initWhackAMouseFns);
  }
};
