const name = 'article';

function stylizeHero (el, percent) {
  const startPerc = 0.2;
  const endPerc = 0.5;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: perc,
      transform: `translateX(${(1 - perc) * -100}%)`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: 0,
      transform: `translateX(-100%)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: 1,
      transform: `translateX(0%)`
    });
  }
}

function stylizeBlockquote (el, percent) {
  const startPerc = 0.4;
  const endPerc = 0.7;
  const perc = (percent - startPerc) / (endPerc - startPerc);
  
  if (startPerc < percent && percent < endPerc) {
    Object.assign(el.style, {
      opacity: perc,
      transform: `translateX(${(1 - perc) * 100}%)`
    });
  } else if (percent < startPerc) {
    Object.assign(el.style, {
      opacity: 0,
      transform: `translateX(100%)`
    });
  } else if (percent > endPerc) {
    Object.assign(el.style, {
      opacity: 1,
      transform: `translateX(0%)`
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
    const hero = section.querySelector('.hero');
    const blockquote = section.querySelector('.blockquote');
    
    if (ratio > 0.8) fadeOut([section, hero, blockquote], ratio);
    else section.style.opacity = '1'
    
    stylizeHero(hero, ratio);
    stylizeBlockquote(blockquote, ratio);
  }
}

function toggleArticle (article) {
  console.log(article.dataset.open);
  if (article.dataset.open === 'true') {
    article.style.display = 'none';
    article.dataset.open = 'false';
  } else {
    article.style.display = 'block';
    article.dataset.open = 'true';
  }
}

function init (tries = 20) {
  const section = document.querySelector(`[class*="section--${name}"]`);
  if (!section && tries) return setTimeout(init, 20, --tries);
  
  const article = section.querySelector('.article');
  
  article.style.pointerEvents = 'auto';
  
  section.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', toggleArticle.bind(null, article));
    btn.style.pointerEvents = 'auto';
  });
}

init();