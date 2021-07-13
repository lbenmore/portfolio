core.controllers.Menu = () => {
	const initFns = () => {
		const
		setDarkMode = () => {
      var toMode = document.body.dataset.darkmode == 'true' ? 'false' : 'true';
		  document.body.dataset.darkmode = toMode;
      $$('meta[name="theme-color"]').setAttribute('content', '#' + (toMode === 'true' ? '343038' : 'f8f4f0'));
		  $$.ls('set', 'darkmode', toMode);
		};
	
		$$('.menu__darkmode input').on('change', setDarkMode);
	
		if (document.body.dataset.darkmode == 'true') {
			$$('.menu__darkmode input').checked = true;
		}
	};

	if (core.isLoaded()) {
		initFns();
	} else {
		core.events.addEventListener('load', initFns, {once: true});
	}
};
