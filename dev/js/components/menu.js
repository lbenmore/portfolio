core.controllers.Menu = () => {
	const
	setDarkMode = () => {
	  document.body.dataset.darkmode = document.body.dataset.darkmode == 'true' ? 'false' : 'true';
	  $$.ls('set', 'darkmode', document.body.dataset.darkmode);
	};

	$$('.menu__darkmode input').on('change', setDarkMode);

	if (document.body.dataset.darkmode == 'true') {
		$$('.menu__darkmode input').checked = true;
	}
};
