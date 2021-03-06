core.controllers.Header = () => {
  const initFns = (e) => {
    const _this = core.controllers.Header;

    const pageObjName = location.hash.slice(1);
    const pageObj = core.pages[pageObjName];
    const pageName = pageObj.name;

    _this.pageTitle = pageName;
    $$('[data-controller=Header]').innerHTML = $$('[data-controller=Header]').innerHTML.replace(/\{\{pageTitle\}\}/g, pageName);
  };

	if (core.isLoaded()) {
		initFns();
	} else {
		core.events.addEventListener('load', initFns, {once: true});
	}
};
