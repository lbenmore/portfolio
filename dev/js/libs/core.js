const
core = {};
core.fns = {};
core.controllers = {};
core.globals = {};
core.proxies = {};

core.fns.setGlobalsInDom = () => {
  for (const el of document.querySelectorAll('*[data-global]')) {
    el.innerHTML = core.proxies[el.dataset.global];
  }
};

core.fns.handleGlobals = () => {
  core.proxies = Object.assign({}, core.globals);

  core.globals = new Proxy(core.proxies, {
    set: function (target, property, value) {
      core.proxies[property] = value;
      core.fns.setGlobalsInDom();
      return true;
    }
  });

  core.fns.setGlobalsInDom();
};

core.fns.loadControllers = () => {
  for (const cntl of document.querySelectorAll('*[data-controller]')) {
    core.controllers[cntl.dataset.controller]();
  }

  core.fns.handleGlobals();
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
          if (curr == total && callback) callback.call();
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

      let currScript = 0;

      $$.preload(all, () => {
        $$.ajax({
          url: html,
          callback: (response) => {
            const onAllScriptsLoaded = () => {
              $$('.container').innerHTML = response;
              core.fns.loadIncludes(core.fns.loadControllers);
            };

            $$('div[data-styles]').innerHTML = '';
            for (const stylesheet of css) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = stylesheet;
              $$('div[data-styles]').appendChild(link);
            }

            $$('div[data-scripts]').innerHTML = '';
            if (js.length) {
              for (const scriptfile of js) {
                const script = document.createElement('script');
                script.src = scriptfile;
                $$('div[data-scripts]').appendChild(script);

                script.onload = () => {
                  ++currScript;
                  if (currScript == js.length) onAllScriptsLoaded();
                };
              }
            } else {
              onAllScriptsLoaded();
            }
          }
        })
      })
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

            if (!window.location.hash) core.fns.go(Object.keys(core.pages)[0]);
            else core.fns.loadPage();

            addEventListener('hashchange', core.fns.loadPage);
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
