const name = 'outside';

function stylizeTitle (el, percent) {
  const startPerc = 0.33;
  const endPerc = 0.8;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  const midPerc = (startPerc + endPerc) / 2;
  const halfPerc = (percent - midPerc) / (endPerc - midPerc);
  
  if (startPerc < percent && percent < midPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      zIndex: '0',
      transform: `translateY(${-200 * (perc * 2)}%) scale(${0.5 + (0.5 * percent)})`
    });
  } else if (midPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      zIndex: '1',
      transform: `translateY(${-200 + (200 * halfPerc)}%) scale(${0.5 + (0.5 * percent)})`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      zIndex: '0',
      transform: `translateY(0)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: `1`,
      zIndex: '1',
      transform: `translateY(0%)`
    });
  }
}

function stylizeTrees (el, percent) {
  const startPerc = 0.25;
  const endPerc = 0.7;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateY(${(1 - perc) * 100}%)`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translateY(100%)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateY(0%)`
    });
  }
}

function stylizeMoon (el, percent) {
  const startPerc = 0.25;
  const endPerc = 0.5;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateY(${(1 - perc) * 100}%)`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translateY(100%)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateY(0%)`
    });
  }
}

function stylizeMountain (el, percent) {
  const startPerc = 0;
  const endPerc = 0.3;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: `${1 * perc}`,
      transform: `translateY(${(0.5 - (0.5 * perc)) * 100}%)`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: `0`,
      transform: `translateY(100%)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: `1`,
      transform: `translateY(0%)`
    });
  }
}

function fadeOut (els, ratio) {
  const perc = (ratio - 0.8) / (1 - 0.8);
  els.forEach(el => {
    Object.assign(el.style, {
      opacity: 1 - perc
    });
  }); 
}

function onScroll (evt) {
  const section = document.querySelector(`[class*="section--${name}"]`);
  if (section) {
    const { ratio } = evt.detail;
    const mountain = section.querySelector('.mountain');
    const moon = section.querySelector('.moon');
    const trees = section.querySelector('.trees');
    const title = section.querySelector('.title');
    
    if (ratio > 0.8) fadeOut([section, mountain, moon, trees, title], ratio);
    else section.style.opacity = '1';
    
    stylizeMountain(mountain, ratio);
    stylizeMoon(moon, ratio);
    stylizeTrees(trees, ratio);
    stylizeTitle(title, ratio);
  }
}