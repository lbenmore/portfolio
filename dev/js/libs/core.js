const core = {};

core.fns = {};
core.controllers = {};
core.pages = {};
core.events = document.createElement('event');

core.events.load = new CustomEvent('load');
core.events.init = new CustomEvent('init');

core.events.load.assets = [];
core.events.init.hasLoaded = false;

core.isLoaded = () => core.events.load.assets.length == 0;
core.isInit = () => core.events.init.hasLoaded;

core.fns.loadControllers = () => {
	const ctlrs = Array.from(document.querySelectorAll('[data-controller]'));
	
	for (const ctlr of ctlrs) {
		try {
			core.controllers[ctlr.dataset.controller]();
		} catch (e) {
			$$.log(`loadControllers -> ${e.message}`, 'error');
		}
	}

	core.events.load.assets.splice(core.events.load.assets.indexOf('data-controller'), 1);
	
	core.events.dispatchEvent(core.events.load);
};

core.fns.loadIncludes = (callback) => {
	const incEls = Array.from(document.querySelectorAll('[data-include]'));
	const incUrls = incEls.filter((inc) => inc.dataset.include);
	
	const onIncludeLoad = (incUrl) => {
		incUrls.splice(incUrls.indexOf(incUrl), 1);
		
		if (!incUrls.length) {
			if (document.body.innerHTML.includes('data-include')) return core.fns.loadIncludes(callback);
		
			core.events.load.assets.splice(core.events.load.assets.indexOf('data-include'), 1);
			
			if (callback) {
				callback.call();
			} else {
				core.events.dispatchEvent(core.events.load);
			}
		}
	};
		
	if (incEls.length) {
		for (const incEl of incEls) {
			const incUrl = incEl.dataset.include;
			
			$$.ajax({
				url: incUrl,
				callback: (html) => {
					const el = document.createElement(incEl.tagName.toLowerCase());
					
					el.innerHTML = html;
					el.className = incEl.className;
					el.attributes = incEl.attributes;
					el.dataset = {};
					
					incEl.parentNode.insertBefore(el, incEl);
					incEl.parentNode.removeChild(incEl);
					
					onIncludeLoad(incUrl);
				}
			});
		}
	} else {
		onIncludeLoad(null);
	}
};

core.fns.loadPage = () => {
	try {
		const pageId = location.hash.slice(1);
		if (!pageId in core.pages) core.fns.go(Object.keys(core.pages)[0]);
		const page = core.pages[pageId];
		
		const htmlUrl = page.html;
		const stylesheets = 'css' in page ? page.css : [];
		const scripts = 'js' in page ? page.js : [];
		const assets = 'assets' in page ? page.assets : [];
		
		const onAssetLoad = (assetUrl, html) => {
			core.events.load.assets.splice(core.events.load.assets.indexOf(assetUrl), 1);

			if (!core.events.load.assets.length) {
				$$('.container').innerHTML = html;
				
				if (html.indexOf('data-include') > -1) core.events.load.assets.push('data-include');
				if (html.indexOf('data-controller') > -1) core.events.load.assets.push('data-controller');
				
				core.fns.loadIncludes(core.fns.loadControllers);
			}
		};
		
		core.events.load.assets = [...stylesheets, ...scripts, ...assets];
		
		$$.ajax({
			url: htmlUrl,
			callback: (html) => {
				$$('div[data-css]').innerHTML = '';
				for (const resourceUrl of stylesheets) {
					const link = document.createElement('link');
					
					link.rel = 'stylesheet';
					link.href = resourceUrl;
					
					link.onload = onAssetLoad.bind(null, resourceUrl, html);
					
					$$('div[data-css]').appendChild(link);
				}
				
				$$('div[data-js]').innerHTML = '';
				for (const resourceUrl of scripts) {
					const script = document.createElement('script');
					
					script.src = resourceUrl;
					
					script.onload = onAssetLoad.bind(null, resourceUrl, html);
					
					$$('div[data-js]').appendChild(script);
				}
				
				for (const resourceUrl of assets) {
					const img = new Image();
					
					img.src = resourceUrl;
					
					img.onload = img.onerror = onAssetLoad.bind(null, resourceUrl, html);
				}
			}
		});
	} catch (e) {
		$$.log(`loadPage -> ${e.message}`, 'error');
	}
};

core.fns.go = (pageId) => {
	try {
		location.hash = `#${pageId}`;
	} catch (e) {
		$$.log(`go -> ${e.message}`, 'error');
	}
};

core.fns.init = () => {
	$$.ajax({
		type: 'json',
		url: './config.json',
		callback: (config) => {
			Object.assign(core, config);
			
			if (location.hash) core.fns.loadPage();
			else core.fns.go(Object.keys(core.pages)[0]);
			
			addEventListener('hashchange', core.fns.loadPage);
			
			core.events.init.hasLoaded = true;
			core.events.dispatchEvent(core.events.init);
		}
	});
};

$$(document).on('DOMContentLoaded', core.fns.init);