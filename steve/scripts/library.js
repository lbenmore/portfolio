const
responsify = () => {
  let
  gameW = parseInt(getComputedStyle(document.querySelector('.container')).width),
  gameH = parseInt(getComputedStyle(document.querySelector('.container')).height),
  gameR = gameW / gameH,
  winW = innerWidth,
  winH = innerHeight,
  winR = winW / winH;

  if (gameW > winW || gameH > winH) {
    if (gameR > winR) {
      document.querySelector('.container').style.transform = `translate(-50%, -50%) scale(${winW / gameW})`;
    } else {
      document.querySelector('.container').style.transform = `translate(-50%, -50%) scale(${winH / gameH})`;
    }
  } else {
    document.querySelector('.container').style.transform = 'translate(-50%, -50%)';
  }
},

replayGame = (target, btnReplay, steve, cacti, doomCactus, score) => {
  btnReplay.parentNode.removeChild(btnReplay);

  cacti.splice(cacti.indexOf(doomCactus, 1));
  doomCactus.parentNode.removeChild(doomCactus);

  score.reset();

  steve.walk();
  steve.updateCactiSpeed(5);
  steve.initCacti(target);
  steve.setGameIsActive(true);
},

endGame = (target, steve, cacti, doomCactus, score) => {
  let btnReplay = document.createElement('button');
  btnReplay.classList.add('btnReplay');
  target.appendChild(btnReplay);

  btnReplay.addEventListener('click', replayGame.bind(null, target, btnReplay, steve, cacti, doomCactus, score));

  cacti.forEach((_cactus) => {
    if (_cactus != doomCactus) {
      cacti.splice(cacti.indexOf(_cactus), 1);
      _cactus.parentNode.removeChild(_cactus);
    }
  });

  steve.setGameIsActive(false);
  steve.stop();
},

animSteve = (steve, dir) => {
  cancelAnimationFrame(steve.raf);

  let
  boxTop = parseInt(steve.element.parentNode.getBoundingClientRect().top),
  boxHeight = parseInt(steve.element.parentNode.getBoundingClientRect().height),
  steveTop = parseInt(steve.element.getBoundingClientRect().top),
  steveHeight = parseInt(steve.element.getBoundingClientRect().height),
  startValue = (boxTop + boxHeight) - (steveTop + steveHeight);

  switch (dir) {
    case 'up':
      if (startValue < 220) {
        steve.element.style.bottom = `${startValue + 5}px`;
        steve.raf = requestAnimationFrame(animSteve.bind(null, steve, 'up'));
      } else {
        steve.raf = requestAnimationFrame(animSteve.bind(null, steve, 'down'));
      }
    break;

    case 'down':
      if (startValue > 71) {
        steve.element.style.bottom = `${startValue - 5}px`;
        steve.raf = requestAnimationFrame(animSteve.bind(null, steve, 'down'));
      }
    break;
  }
},

animCactus = (el, target, steve, cacti, cactiSpeed, score, lastUpdated = []) => {
  if (!el.parentNode) return;

  let
  cactusBox = el.getBoundingClientRect(),
  steveBox = steve.element.getBoundingClientRect(),
  startValue = parseInt(cactusBox.left) - parseInt(el.parentNode.getBoundingClientRect().left),
  endValue = -100;

  if (
    steveBox.left + steveBox.width > cactusBox.left &&
    steveBox.left < cactusBox.left + cactusBox.width &&
    steveBox.top + steveBox.height > cactusBox.top
  ) {
    endGame(target, steve, cacti, el, score);
    return;
  }

  if (startValue > endValue) {
    if (score.currentScore % 5 == 0 && score.currentScore != 0 && !lastUpdated.includes(score.currentScore)) {
      lastUpdated.push(score.currentScore);
      steve.updateCactiSpeed(steve.cactiSpeed + 1);
      cactiSpeed = steve.cactiSpeed;
    }
    el.style.left = `${startValue - cactiSpeed}px`;
    requestAnimationFrame(animCactus.bind(null, el, target, steve, cacti, cactiSpeed, score, lastUpdated));
  } else {
    target.removeChild(el);
    cacti.splice(cacti.indexOf(el), 1);
    setTimeout(() => {
      if (steve.gameIsActive) new Cactus(target, steve, cacti, score);
    }, Math.round(Math.random() * 1000));
    score.increase(1);
  }
};

class Score {
  constructor (target, startScore) {
    this.currentScore = startScore;
    this.highScore = startScore;

    this.element = document.createElement('div');
    this.elements = {};

    this.element.classList.add('score');

    this.elements.currentScore = document.createElement('span');
    this.elements.currentScore.classList.add('score__current');

    this.elements.highScore = document.createElement('span');
    this.elements.highScore.classList.add('score__high');

    this.element.appendChild(this.elements.highScore);
    this.element.appendChild(this.elements.currentScore);
    target.appendChild(this.element);

    this.setView();
  }

  setView () {
    this.elements.currentScore.innerHTML = `Score: ${this.currentScore}`;
    this.elements.highScore.innerHTML = `High Score: ${this.highScore}`;
  }

  increase (pointValue) {
    this.currentScore += pointValue;
    if (this.currentScore > this.highScore) this.highScore = this.currentScore;
    this.setView();
  }

  reset () {
    this.currentScore = 0;
    this.setView();
  }
}

class Cactus {
  constructor (target, steve, cacti, score) {
    this.element = document.createElement('div');
    this.armLeft = document.createElement('div');
    this.armRight = document.createElement('div');

    this.element.classList.add('cactus');
    if (Math.round(Math.random())) this.element.classList.add('short');

    this.armLeft.classList.add('cactus__arm');
    this.armLeft.classList.add('cactus__arm--left');
    this.element.classList.add('cactus');
    this.armRight.classList.add('cactus__arm');
    this.armRight.classList.add('cactus__arm--right');

    this.element.appendChild(this.armLeft);
    this.element.appendChild(this.armRight);
    target.appendChild(this.element);

    cacti.push(this.element);

    setTimeout(animCactus.bind(null, this.element, target, steve, cacti, steve.cactiSpeed, score), 100);
  }
};

class Steve {
  constructor (target) {
    this.element = document.createElement('div');
    this.element.classList.add('steve');
    this.element.classList.add('stepleft');

    this.legs = {};
    this.legs.left = document.createElement('span');
    this.legs.right = document.createElement('span');
    this.head = document.createElement('span');
    this.arms = document.createElement('span');
    this.body = document.createElement('span');
    this.tail = document.createElement('span');

    this.legs.left.classList.add('steve__leg');
    this.legs.left.classList.add('steve__leg--left');
    this.legs.right.classList.add('steve__leg');
    this.legs.right.classList.add('steve__leg--right');
    this.head.classList.add('steve__head');
    this.arms.classList.add('steve__arms');
    this.body.classList.add('steve__body');
    this.tail.classList.add('steve__tail');

    this.element.appendChild(this.legs.left);
    this.element.appendChild(this.legs.right);
    this.element.appendChild(this.head);
    this.element.appendChild(this.arms);
    this.element.appendChild(this.body);
    this.element.appendChild(this.tail);

    target.appendChild(this.element);

    this.gameIsActive = true;
    this.cacti = [];
    this.cactiSpeed = 5;
    this.raf = null;

    this.walk();
    this.initScore();
    this.initCacti(target);

    addEventListener('keypress', (e) => {
      if (e.charCode == 32) this.bounce();
    });

    addEventListener('touchstart', this.bounce.bind(this));
  }

  walk () {
    this.walkInterval = setInterval(() => {
      this.element.classList.toggle('stepleft');
      this.element.classList.toggle('stepright');
    }, 250);
  }

  stop () {
    clearInterval(this.walkInterval);
  }

  bounce () {
    animSteve(this, 'up');
  }

  initScore () {
    this.score = new Score(document.querySelector('.container'), 0);
  }

  initCacti (target) {
    new Cactus(target, this, this.cacti, this.score);
    setTimeout( () => {
      new Cactus(target, this, this.cacti, this.score);
      // setTimeout( () => {
      //   new Cactus(document.querySelector('.container'), this, this.cacti, this.score);
      // }, 1000);
    }, 2000);
  }

  updateCactiSpeed (value) {
    this.cactiSpeed = value;
  }

  setGameIsActive (value) {
    this.gameIsActive = value;
  }
};

class Background {
  constructor (target) {
    this.element = document.createElement('div');
    this.element.classList.add('background');

    this.makeDirt(this.element);

    target.appendChild(this.element);
  }

  makeDirt (target) {
    for (let i = 0; i < 50; i++) {
      let
      dirt = document.createElement('div'),
      size = Math.floor(Math.random() * 3 + 1);

      dirt.classList.add('dirt');

      dirt.style.top = `${Math.floor(Math.random() * 100)}px`;
      dirt.style.left = `${Math.floor(Math.random() * 960)}px`;
      dirt.style.width = `${size}px`;
      dirt.style.height = `${size}px`;

      target.appendChild(dirt);
    }
  }
};

const
initSteve = () => {
  new Steve(document.querySelector('.container'));
},

initGame = () => {
  new Background(document.querySelector('.container'));
  initSteve();
  // the method used in responsify fucks with cacti and steve speed
  // responsify();
  // addEventListener('resize', responsify);
};

document.addEventListener('DOMContentLoaded', initGame);
