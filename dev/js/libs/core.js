const

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
      }
    })
  }
},

loadAsset = (path) => {
  let ext = path.split('.').pop().toLowerCase();

  switch (ext) {
    case 'css':
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;

      $$('.styles').appendChild(link);
    break;

    case 'js':
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = path;

      $$('.scripts').appendChild(script);
    break;
  }
},

loadPage = () => {
  try {
    const pageName = location.hash.slice(2);

    try {
      const
      pageObj = $$.config.pages[pageName],
      assets = [...pageObj.css, ...pageObj.js];

      $$.ajax({
        url: pageObj.html,
        callback: (html) => {
          $$.preload(assets, () => {
            $$('.styles').innerHTML = '';
            for (const css of pageObj.css) {
              loadAsset(css);
            }

            $$('.container').innerHTML = html;

            $$('.scripts').innerHTML = '';
            for (const js of pageObj.js) {
              loadAsset(js);
            }

            for (const prop in document.body.dataset) {
              document.body.dataset[prop] = null;
            }

            loadIncludes();
          });
        }
      });
    } catch (e) {
      $$.log(e, 'error');
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
    url: './assets/json/config.json',
    callback: onConfigLoad
  });
};

$$.go = go;

document.addEventListener('DOMContentLoaded', initCore);
