const core = {}, LOAD_EVENT = new CustomEvent('LOAD_EVENT');

core.fns = {};
core.controllers = {};
core.config = null;

core.fns.loadControllers = () => {
  const cntls = document.querySelectorAll('*[data-controller]');

  cntls.forEach((cntl) => {
    cntl.dataset.loaded = 'true';
    core.controllers[cntl.dataset.controller]();
  });
};

core.fns.loadIncludes = () => {
  const incs = document.querySelectorAll('*[data-include]:not([data-loaded])');

  for (const inc of incs) {
    $$.ajax({
      url: inc.dataset.include,
      callback: (html) => {
        let scripts;
        inc.innerHTML = html;

        scripts = inc.querySelectorAll('script');
        for (const script of scripts) {
          eval(script.innerHTML);
        }

        $$.loaded = true;
        dispatchEvent(LOAD_EVENT);
      }
    })
  }
};

core.fns.executeJs = (scripts) => {
  const total = scripts.length;
  let curr = 0;

	for (const script of scripts) {
		$$('.scripts').appendChild(script);
    script.onload = () => {
      ++curr;
      if (curr == total) core.fns.loadControllers();
    }
	}

  $$.loaded = true;
  dispatchEvent(LOAD_EVENT);
};

core.fns.loadAsset = (assets, html, tracker) => {
  const
  filename = assets[tracker.current],
  ext = filename.split('.').pop().toLowerCase();

  switch (ext) {
    case 'css':
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = filename;

      $$('.styles').appendChild(link);
    break;

    case 'js':
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = filename;

      tracker.scripts.push(script);
    break;
  }

  ++tracker.current;
  core.fns.loadAssets(assets, html, tracker);
};

core.fns.loadAssets = (assets, html, tracker) => {
	if (tracker.current < tracker.total) {
		core.fns.loadAsset(assets, html, tracker);
	} else {
		$$('.container').innerHTML = html;
		core.fns.executeJs(tracker.scripts);

    if (html.includes('data-include')) core.fns.loadIncludes();
	}
};

core.fns.loadPage = () => {
  try {
    const pageName = location.hash.slice(2);

    $$.loaded = false;

    if (core.config.pages.hasOwnProperty(pageName)) {
      const
      pageObj = core.config.pages[pageName],
      assets = [...pageObj.css, ...pageObj.js],
      tracker = {
				current: 0,
				total: assets.length,
				scripts: []
			};

      $$.ajax({
        url: pageObj.html,
        callback: (html) => {
          $$.preload(assets, () => {
            $$('.styles').innerHTML = '';
            $$('.scripts').innerHTML = '';

            for (const prop in document.body.dataset) {
              // document.body.dataset[prop] = null;
            }

            core.fns.loadAssets(assets, html, tracker);
          });
        }
      });
    } else {
    	$$.log('Requested page does not exist', 'error');
    	core.fns.go('home');
    }
  } catch (e) {
    $$.log(e, 'error');
  }
};

core.fns.go = (pageName) => {
  try {
    if (core.config.pages[pageName]) {
      location.hash = `#/${pageName}`;
    } else {
      core.fns.go('home');
    }
  } catch (e) {
    try {
      core.fns.go('home');
    } catch (e) {
      $$.log(e, 'error');
    }
  }
};

core.fns.onConfigLoad = (config) => {
  core.config = config;
  if (location.hash) core.fns.loadPage();
  else core.fns.go('home');
  addEventListener('hashchange', core.fns.loadPage);
};

core.fns.initCore = () => {
  $$.ajax({
    type: 'json',
    url: './config.json',
    callback: core.fns.onConfigLoad
  });
};

$$.go = core.fns.go;
$$.loaded = false;

document.addEventListener('DOMContentLoaded', core.fns.initCore);
