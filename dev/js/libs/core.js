const

LOAD_EVENT = new CustomEvent('LOAD_EVENT');

loadIncludes = () => {
  const incs = document.querySelectorAll('*[data-include]');

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

        dispatchEvent(LOAD_EVENT);
      }
    })
  }
},

executeJs = (scripts) => {
	for (const script of scripts) {
		$$('.scripts').appendChild(script);
	}

  dispatchEvent(LOAD_EVENT);
},

loadAsset = (assets, html, tracker) => {
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
  loadAssets(assets, html, tracker);
},

loadAssets = (assets, html, tracker) => {
	if (tracker.current < tracker.total) {
		loadAsset(assets, html, tracker);
	} else {
		$$('.container').innerHTML = html;
		executeJs(tracker.scripts);
	}
},

loadPage = () => {
  try {
    const pageName = location.hash.slice(2);

    if ($$.config.pages.hasOwnProperty(pageName)) {
      const
      pageObj = $$.config.pages[pageName],
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
              document.body.dataset[prop] = null;
            }

            loadAssets(assets, html, tracker);
            loadIncludes();
          });
        }
      });
    } else {
    	$$.log('Requested page does not exist', 'error');
    	go('home');
    }
  } catch (e) {
    $$.log(e, 'error');
  }
},

go = (pageName) => {
  try {
    if ($$.config.pages[pageName]) {
      location.hash = `#/${pageName}`;
    } else {
      go('home');
    }
  } catch (e) {
    try {
      go('home');
    } catch (e) {
      $$.log(e, 'error');
    }
  }
},

onConfigLoad = (config) => {
  $$.config = config;
  if (location.hash) loadPage();
  else go('home');
  addEventListener('hashchange', loadPage);
},

initCore = () => {
  $$.ajax({
    type: 'json',
    url: './config.json',
    callback: onConfigLoad
  });
};

$$.go = go;

document.addEventListener('DOMContentLoaded', initCore);
