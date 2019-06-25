const
core = {};
core.fns = {};
core.controllers = {};
core.events = {};
core.unloadedAssets = [];

core.events.init = new CustomEvent("coreinit");
core.events.load = new CustomEvent("coreload");

core.isInitialized = () => false;
core.isLoaded = () => core.unloadedAssets.length == 0;

core.fns.getContainingControllerElement = (el) => {
  if (el.dataset.hasOwnProperty('controller')) return el;
  else if (el.parentNode) return core.fns.getContainingControllerElement(el.parentNode);
  else return false;
};

core.fns.setDOMStringReplacement = () => {
  for (const el of document.querySelectorAll('[data-var]')) {
    const containingController = core.fns.getContainingControllerElement(el);
    const ctlrName = containingController.dataset.controller;
    let ctlr = core.controllers[ctlrName];

    el.innerHTML = ctlr[el.dataset.var];
  }
};

core.fns.initDOMStringReplacement = () => {
  for (const el of document.querySelectorAll('*')) {
    if (el.children.length) continue;

    if (el.textContent.includes('{{') && el.textContent.includes('}}')) {
      const varName = el.textContent.split('{{')[1].split('}}')[0];
      const containingController = core.fns.getContainingControllerElement(el);
      const ctlrName = containingController.dataset.controller;

      el.innerHTML = el.innerHTML.replace(`{{${varName}}}`, `<custom data-var="${varName}">${varName}</custom>`);

      core.controllers[ctlrName] = new Proxy(core.controllers[ctlrName], {
        set: (o, p, v) => {
          o[p] = v;
          core.fns.setDOMStringReplacement();
          return true;
        }
      });
    }
  }

  dispatchEvent(core.events.load);

  core.fns.setDOMStringReplacement();
};

core.fns.loadControllers = () => {
  for (const ctlr of document.querySelectorAll('*[data-controller]')) {
    if (core.controllers[ctlr.dataset.controller]) core.controllers[ctlr.dataset.controller]();
  }

  core.unloadedAssets.splice(core.unloadedAssets.indexOf('data-controller'), 1);

  core.fns.initDOMStringReplacement();
};

core.fns.loadIncludes = (callback) => {
  const total = document.querySelectorAll('*[data-include]').length;
  let curr = 0;

  if (total) {
    for (const inc of document.querySelectorAll('*[data-include]')) {
      const el = document.createElement(inc.tagName.toLowerCase());
      $$.ajax({
        url: inc.dataset.include,
        callback: (html) => {
          el.innerHTML = html;
          el.className = inc.className
          inc.parentNode.insertBefore(el, inc);
          inc.parentNode.removeChild(inc);

          ++curr;

          if (curr == total) {
            if (document.querySelectorAll('*[data-include]').length) {
              core.fns.loadIncludes(callback);
            } else if (callback) {
              core.unloadedAssets.splice(core.unloadedAssets.indexOf('data-include'), 1);
              callback.call();
            } else {
              core.unloadedAssets.splice(core.unloadedAssets.indexOf('data-include'), 1);
            }
          }
        }
      });
    }
  } else {
    if (callback) callback.call();
  }
};

core.fns.pageLoadError = () => {
  $$.log('The page your are trying to load does not exist. Redirecting...', 'error');
  core.fns.go(Object.keys(core.pages)[0]);
};

core.fns.loadPage = () => {
  const page = window.location.hash.slice(1);
    if (core.pages[page]) {
      const
      html = core.pages[page].html,
      css = core.pages[page].hasOwnProperty('css') ? core.pages[page].css : [],
      js = core.pages[page].hasOwnProperty('js') ? core.pages[page].js : [],
      assets = core.pages[page].hasOwnProperty('assets') ? core.pages[page].assets : [],
      all = [...css, ...js, ...assets];
      let loaded = assets.length;

      core.unloadedAssets = [...css, ...js, ...assets];

      $$.ajax({
        url: html,
        callback: (response) => {
          const onAssetLoad = (asset, e) => {
            ++loaded;

            core.unloadedAssets.splice(core.unloadedAssets.indexOf(asset), 1);

            if (loaded == all.length) {
              $$('.container').innerHTML = response;
              core.fns.loadIncludes(core.fns.loadControllers);

              for (const asset of document.querySelectorAll('div[data-css] *, div[data-js] *')) {
                if (asset.dataset.new == 'true') {
                  asset.dataset.new = null;
                } else {
                  asset.parentNode.removeChild(asset);
                }
              }
            }
          };

          if (response.includes('data-include')) core.unloadedAssets.push('data-include');
          if (response.includes('data-controller')) core.unloadedAssets.push('data-controller');

          for (const stylesheet of css) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylesheet;
            link.dataset.new = true;
            $$('div[data-css]').appendChild(link);

            link.onload = onAssetLoad.bind(null, stylesheet);
          }

          for (const scriptfile of js) {
            const script = document.createElement('script');
            script.src = scriptfile;
            script.dataset.new = true;
            $$('div[data-js]').appendChild(script);

            script.onload = onAssetLoad.bind(null, scriptfile);
          }
        }
      });
    } else {
      core.fns.pageLoadError();
    }
};

core.fns.go = (page) => {
  if (core.pages[page]) {
    window.location.hash = page;
  } else {
    core.fns.pageLoadError();
  }
};

core.fns.initCore = () => {
  $$.ajax({
    type: 'json',
    url: './config.json',
    callback: (response) => {
      try {
        if (response) {
          if (response.pages) {
            Object.assign(core, response);

            addEventListener('hashchange', core.fns.loadPage);

            if (!window.location.hash) core.fns.go(Object.keys(core.pages)[0]);
            else core.fns.loadPage();

            core.isInitialzed = () => true;
            dispatchEvent(core.events.init);
          }
        } else {
          $$.log('Error retrieving config: No response', 'error');
        }
      } catch (e) {
        $$.log('Error retrieving config: ' + e.message, 'error');
      }
    }
  })
};

document.addEventListener('DOMContentLoaded', core.fns.initCore);
