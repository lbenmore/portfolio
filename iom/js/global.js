loadPage = (pageName, params) => {
  window.location.hash = `#/${pageName}`;
  if ($$.exists(params)) {
    window.location.hash += '/?';
    for (let key in params) {
      window.location.hash += `${key}=${encodeURIComponent(params[key])}&`;
    }
  }
  loadWindowLocation();
}

loadIncludes = () => {
  for (let include of document.querySelectorAll('include')) {
    $$.ajax({
      url: include.getAttribute('src')
    }, (html) => {
      let div = document.createElement('div');
      div.innerHTML = html;
      include.parentNode.insertBefore(div, include);
      setTimeout(() => { include.parentNode.removeChild(include); }, 100);
    })
  }
}

loadWindowLocation = () => {
  let
  hash = window.location.hash.slice(1),
  dirs = hash.split('/');

  for (let dir of dirs) {
    if (!$$.exists(dir)) dirs.splice(dirs.indexOf(dir), 1);
  }

  if (app.pages[dirs[0]]) {
    let
    objPage = app.pages[dirs[0]],
    assets = objPage.stylesheets.concat(objPage.scripts),
    numAssetsLoaded = 0;

    for (let asset of assets) {
      let preload = new Image();
      preload.src = asset;
      preload.onerror = () => {
        ++numAssetsLoaded;
        checkAssetsLoaded();
      }
    }

    checkAssetsLoaded = () => {
      if (numAssetsLoaded == assets.length) {
        $$.ajax({
          url: objPage.html
        }, (html) => {
          $$('.stylesheets').innerHTML = '';
          $$('.scripts').innerHTML = '';

          for (let stylesheet of objPage.stylesheets) {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylesheet;
            $$('.stylesheets').appendChild(link);
          }
          $$('.scripts').innerHTML = '';

          for (let js of objPage.scripts) {
            let script = document.createElement('script');
            script.src = js;
            $$('.scripts').appendChild(script);
          }

          $$('.container').innerHTML = html;

          loadIncludes();
        });
      }
    }
  }
}

checkForLocationStringAndLoad = () => {
  if (!$$.exists(window.location.hash)) {
    window.location += '#/signin';
  }

  loadWindowLocation();

  onhashchange = () => { window.location.reload(); };
}

loadConfig = () => {
  let config = document.createElement('script');
  config.src = './js/config.js';
  $$('body').appendChild(config);
  config.onload = checkForLocationStringAndLoad;
}

document.addEventListener('DOMContentLoaded', loadConfig);
