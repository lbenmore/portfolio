var
renderInclude = function (element) {
  var
  path = element.dataset.includeSrc,
  tag = element.dataset.includeHtmlTag || 'div',
  newEl = document.createElement(tag);

  $$.ajax({
    url: path
  }, function (html) {
    for (var j = 0; j < element.attributes.length; j++) {
      if (element.attributes[j].name.indexOf('include') == -1) {
        newEl.setAttribute(element.attributes[j].name, element.attributes[j].value);
      }
    }

    newEl.innerHTML = html;

    element.parentNode.insertBefore(newEl, element);
    element.parentNode.removeChild(element);

    if (newEl.querySelector('script')) {
      for (var i = 0; i < newEl.querySelectorAll('script').length; i++) {
        eval(newEl.querySelectorAll('script')[i].innerHTML);
      }
    }
  });
},

parseIncludes = function () {
  var includes = document.querySelectorAll('*[data-include-src]');

  for (var i = 0; i < includes.length; i++) {
    renderInclude(includes[i]);
  }
},

createAsset = function (path, tag) {
  var el = document.createElement(tag);
  switch (tag) {
    case 'link':
      el.setAttribute('rel', 'stylesheet');
      el.setAttribute('href', path);
    break;

    case 'script':
      el.setAttribute('type', 'text/javascript');
      el.setAttribute('src', path);
    break;
  }

  return el;
},

loadPage = function (page) {
  $$.ajax({
    url: config.pages[page].html
  }, function (html) {
    var
    styles = config.pages[page].styles,
    scripts = config.pages[page].scripts,
    numAssets = styles.length + scripts.length,
    loadedAssets = 0,
    loadEvent = null,
    loadEl = document.createElement('div');

    if (numAssets) {
      if ('Event' in window) {
        loadEvent = new Event('asset_preload');
      } else {
        loadEvent = document.createEvent('Event');
        loadEvent.initEvent('asset_preload');
      }

      for (var i = 0; i < styles.length; i++) {
        (function () {
          var preload = new Image();
          preload.src = styles[i];
          preload.onerror = function () { loadEl.dispatchEvent(loadEvent); };
        })();
      }

      for (var j = 0; j < scripts.length; j++) {
        (function () {
          var preload = new Image();
          preload.src = scripts[j];
          preload.onerror = function () { loadEl.dispatchEvent(loadEvent); };
        })();
      }

      loadEl.addEventListener('asset_preload', function () {
        ++loadedAssets;
        if (loadedAssets == numAssets) {
          $$('.stylesheets').innerHTML = '';
          for (var k = 0; k < styles.length; k++) {
            $$('.stylesheets').appendChild(createAsset(styles[k], 'link'));
          }

          $$('.container').innerHTML = html;

          $$('.scripts').innerHTML = '';
          for (var l = 0; l < scripts.length; l++) {
            $$('.scripts').appendChild(createAsset(scripts[l], 'script'));
          }

          parseIncludes();
        }
      });
    } else {
      $$('.container').innerHTML = html;
      parseIncludes();
    }
  });
},

go = function (page) {
  try {
    var test = config.pages[page].html;
    window.location.hash = '#/' + page;
  } catch (e) {
    $$.log('Page ' + page + ' does not exist. Rerouting...');
    window.location.hash = '#/home';
  }
},

initCore = function () {
  var page = window.location.hash.slice(2);
  if (!page) {
    go('home');
  } else {
    try {
      var test = config.pages[page].html;
      loadPage(page);
    } catch (e) {
      $$.log('Page ' + page + ' does not exist. Rerouting...');
      go('home');
    }
  }
};

document.addEventListener('DOMContentLoaded', initCore);

addEventListener('hashchange', function () {
  try {
    var page = window.location.hash.slice(2), test = config.pages[page].html;
    loadPage(page);
  } catch (e) {
    $$.log('Page ' + page + ' does not exist. Rerouting...');
    loadPage('home');
  }

  scrollTo(0, 0);
});
