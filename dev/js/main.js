const
setVh = () => {
	document.body.style.setProperty('--vh', `${innerHeight * 0.01}px`);
},

setDarkMode = () => {
  document.body.dataset.darkmode = document.body.dataset.darkmode == 'true' ? 'false' : 'true';
  $$.ls('set', 'darkmode', document.body.dataset.darkmode);
},

initFns = () => {
  if (document.querySelector('.menu__darkmode input')) {
    $$('.menu__darkmode input').on('change', setDarkMode);
  }

  if ($$.ls('get', 'darkmode')) {
    document.body.dataset.darkmode = $$.ls('get', 'darkmode');
  }
  
  setVh();
  addEventListener('resize', setVh);
};

if ($$.loaded) {
  initFns();
} else {
  addEventListener('LOAD_EVENT', initFns);
}
