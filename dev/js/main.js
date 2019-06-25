const
setVh = () => {
	document.body.style.setProperty('--vh', `${innerHeight * 0.01}px`);
},

eventListeners = () => {
	addEventListener('resize', setVh);
},

initFns = (e) => {
  if ($$.ls('get', 'darkmode')) {
    document.body.dataset.darkmode = $$.ls('get', 'darkmode');
  }

  setVh();
	eventListeners();
};

if (core.isInitialized()) {
	initFns();
} else {
	addEventListener("coreload", initFns);
}
