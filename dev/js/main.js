const
setVh = () => {
	document.body.style.setProperty('--vh', `${innerHeight * 0.01}px`);
},

initFns = () => {
  if ($$.ls('get', 'darkmode')) {
    document.body.dataset.darkmode = $$.ls('get', 'darkmode');
  }
  
  setVh();
  addEventListener('resize', setVh);
  addEventListener('hashchange', () => {
  	core.globals.pageTitle = core.pages[location.hash.slice(1)].name;
  });
};

initFns();

/*
if ($$.loaded) {
  initFns();
} else {
  addEventListener('LOAD_EVENT', initFns);
}
*/
