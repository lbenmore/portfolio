const name = 'game';
const blocks = {};

function stylizeDoor1 (el, percent) {
  const startPerc = 0;
  const endPerc = 0.3;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  const doorPercStart = 0.6;
  const doorPercEnd = 0.8;
  const doorPerc = (percent - doorPercStart) / (doorPercEnd - doorPercStart);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateX(calc(${50 * (1 - perc)}vw - ${50 * (1 - perc)}%))`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translate(-50%)`
    });
  } else if (endPerc < percent && percent < doorPercStart) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateX(0)`
    });
  } else if (doorPercStart < percent && percent < doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(${-50 * doorPerc}vw)`
    });
  } else if (percent > doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(-50vw)`
    });
  }
}

function stylizeDoor4 (el, percent) {
  const startPerc = 0.1;
  const endPerc = 0.4;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  const doorPercStart = 0.6;
  const doorPercEnd = 0.8;
  const doorPerc = (percent - doorPercStart) / (doorPercEnd - doorPercStart);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateX(calc(${75 - ((75 - 50) * (1 - perc))}vw - ${50 * (1 - perc)}%))`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translate(-50%)`
    });
  } else if (endPerc < percent && percent < doorPercStart) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateX(75vw)`
    });
  } else if (doorPercStart < percent && percent < doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(${75 + ((125 - 75) * doorPerc)}vw)`
    });
  } else if (percent > doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(125vw)`
    });
  }
}

function stylizeDoor2 (el, percent) {
  const startPerc = 0.2;
  const endPerc = 0.5;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  const doorPercStart = 0.6;
  const doorPercEnd = 0.8;
  const doorPerc = (percent - doorPercStart) / (doorPercEnd - doorPercStart);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateX(calc(${50 - (25 * perc)}vw - ${50 * (1 - perc)}%))`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translate(-50%)`
    });
  } else if (endPerc < percent && percent < doorPercStart) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateX(25vw)`
    });
  } else if (doorPercStart < percent && percent < doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(${-25 + (50 * (1 - doorPerc))}vw)`
    });
  } else if (percent > doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(-25vw)`
    });
  }
}

function stylizeDoor3 (el, percent) {
  const startPerc = 0.3;
  const endPerc = 0.6;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  const doorPercStart = 0.6;
  const doorPercEnd = 0.8;
  const doorPerc = (percent - doorPercStart) / (doorPercEnd - doorPercStart);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateX(calc(50vw - ${50 * (1 - perc)}%))`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translate(-50%)`
    });
  } else if (endPerc < percent && percent < doorPercStart) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateX(50vw)`
    });
  } else if (doorPercStart < percent && percent < doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(${50 + (50 * doorPerc)}vw)`
    });
  } else if (percent > doorPercEnd) {
    Object.assign(el.style, {
      transform: `translateX(100vw)`
    });
  }
}

function stylizeGame (el, percent) {
  const startPerc = 0.6;
  const endPerc = 0.8;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${perc}`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: '0'
    });
  } else if (endPerc < percent) {
    Object.assign(el.style, {
      opacity: '1'
    });
  }
}

function fadeOut (els, percent, blocks) {
  const startPerc = 0.9;
  const endPerc = 1;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  els.forEach(el => {
    el.style.opacity = 1 - perc;
  });
  
  if (blocks.game) blocks.game.stop();
}

function startGame (target) {
  const gameEl = target && target.querySelector('.game');
  gameEl.style.opacity = '1';
  if (!blocks.game) {
    blocks.game = new Blocks(gameEl); 
  } else if (!blocks.game.playing) {
    blocks.game.start();
  }
}

function onScroll (evt) {
  const section = document.querySelector(`[class*="section--${name}"]`);
  
  if (section) {
    const { ratio } = evt.detail;

    const game = section.querySelector('.game');
    const door1 = section.querySelector('.door--1');
    const door2 = section.querySelector('.door--2');
    const door3 = section.querySelector('.door--3');
    const door4 = section.querySelector('.door--4');
    
    if (0.8 < ratio && ratio < 0.9) startGame(section);
    else if (0.9 < ratio) fadeOut([ section, game, door1, door2, door3, door4 ], ratio, blocks);
    
    stylizeDoor1(door1, ratio);
    stylizeDoor2(door2, ratio);
    stylizeDoor3(door3, ratio);
    stylizeDoor4(door4, ratio);
    stylizeGame(game, ratio);
  }
}

function updateStyles (tries = 20) {
  const section = document.querySelector(`[class*="section--${name}"]`);
  if (!section && tries) return setTimeout(updateStyles, 50, --tries);
  const game = section.querySelector('.game');
  
  if (win.innerWidth > win.innerHeight) {
    Object.assign(game, {
      width: '100vh',
      height: '100vh'
    });
  } else {
    Object.assign(game, {
      width: '100vw',
      height: '100vw'
    });
  }
}

updateStyles();
addEventListener('resize', updateStyles);