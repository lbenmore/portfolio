var core = {};

/*=============================================>>>>>
= Core Utilities =
===============================================>>>>>*/

core.preloadAsset = function (path, loadDiv, loadEvt) {
  try {
    var el = new Image();
    el.src = path;

    el.onload = el.onerror = function () {
      loadDiv.dispatchEvent(loadEvt);
    }
  } catch (e) {
    console.error(e);
  }
};

core.getControlleredAncestor = function (el) {
  try {
    if (el.getAttribute('core-controller')) {
      return el.getAttribute('core-controller');
    } else if (el.parentNode) {
      return core.getControlleredAncestor(el.parentNode);
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};


/*= End of Core Utilities =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Core Events =
===============================================>>>>>*/

core.events = {};

core.events.element = document.createElement('div');

core.events.listener = function (evtName, fn) {
  try {
    core.events.element.addEventListener(evtName, fn);
  } catch (e) {
    console.error(e);
  }
};

core.events.dispatch = function (evt, fn) {
  try {
    core.events.element.dispatchEvent(evt);
  } catch (e) {
    console.error(e);
  }
};

core.events.init = function (label) {
  try {
    var event = 'CustomEvent' in window ? new CustomEvent(label) : document.createEvent('Event');
    if (!'CustomEvent' in window) event.initEvent(label);

    return event;
  } catch (e) {
    console.error(e);
  }
}


/*= End of Core Load Event =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Navigation Getters =
===============================================>>>>>*/

core.navigation = function (config, type) {
  try {
    var
    config = config,
    type = type || 'all',
    pn = location.hash.slice(2),
    pageData = config.pages[pn],
    navName = pageData[type],
    navData = config.nav[navName];

    return type == 'all' ? config.nav : navData;
  } catch (e) {
    console.error(e);
  }
};


/*= End of Navigation Getters =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Core Custom Handlers =
===============================================>>>>>*/

core.attachCustomClicks = function () {
  try {
    var els = document.querySelectorAll('*[core-click]');

    for (var i = 0; i < els.length; i++) {
      var
      el = els[i],
      fn = el.getAttribute('core-click');
      ctrl = core.getControlleredAncestor(el),
      fnName = fn.split('(')[0],
      fnParams = fn.split('(')[1].split(')')[0];

      try {
        fnParams = JSON.parse(fnParams);
      } catch (e) {
        console.error(e.message);
      }

      el.addEventListener('click', core.controllers[ctrl][fnName].bind(core.controllers[ctrl], fnParams));
    }
  } catch (e) {
    console.error(e);
  }
}


/*= End of Core Custom Handlers =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Core Page Components =
===============================================>>>>>*/

core.dynamicHtmlProxyHandler = {
  set (target, key, value) {
    try {
      var els = document.querySelectorAll('*');

      target[key] = value;

      for (var i = 0; i < els.length; i++) {
        var
        el = els[i],
        bracket = new RegExp('{{' + key + '}}', 'g');

        if (el.children.length) continue;

        if (el.dataset.hasOwnProperty('coreDynamicHtml')) {
          if (el.dataset.coreDynamicHtml == key) {
            el.textContent = value;
            continue;
          }
        }

        if (el.textContent.indexOf(key) > -1) {
          el.dataset.coreDynamicHtml = key;
          el.innerHTML = el.innerHTML.replace(bracket, value);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};

core.dynamicHtmlProxy = new Proxy({}, core.dynamicHtmlProxyHandler);

core.renderDynamicHtml = function (element) {
  try {
    var bracketyBits = document.body.innerHTML.match(/{{.*}}/g);

    if (!bracketyBits) {
      core.events.dispatch(core.events.load);
      core.attachCustomClicks();
      return;
    }

    for (var i = 0; i < bracketyBits.length; i++) {
      var
      bracket = bracketyBits[i],
      token = bracket.replace(/{/g, '').replace(/}/g, ''),
      parsedValue = $$[token];

      if ('Proxy' in window) {
        core.dynamicHtmlProxy[token] = parsedValue;
      } else {
        for (var j = 0; j < els.length; j++) {
          var
          el = els[j],
          bracket = new RegExp('{{' + key + '}}', 'g');

          if (el.children.length) continue;

          if (el.textContent.indexOf(key) > -1) {
            el.innerHTML = el.innerHTML.replace(bracket, value);
          }
        }
      }
    }

    /*----------- End of Core initialization call stack -----------*/
    core.events.dispatch(core.events.load);
    core.attachCustomClicks();
  } catch (e) {
    console.error(e);
  }
};

core.loadLocalScriptTags = function (element) {
  try {
    var el = element || $$('body');

    if (el.querySelector('script')) {
      for (var k = 0; k < el.querySelectorAll('script').length; k++) {
        eval(el.querySelectorAll('script')[k].innerHTML);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

core.loadControllers = function (element) {
  try {
    var el = element || $$('body');

    for (var k = 0; k < el.querySelectorAll('*[core-controller]').length; k++) {
      var
      ctlName = el.querySelectorAll('*[core-controller]')[k].getAttribute('core-controller'),
      controller = core.controllers[ctlName];

      controller.call(controller);
    }
  } catch (e) {
    console.error(e);
  }
};

core.renderIncludes = function () {
  try {
    var incs = document.querySelectorAll('*[core-include]');

    if (incs.length) {
      for (var i = 0; i < incs.length; i++) {
        (function (iteration, total) {
          var
          inc = document.querySelectorAll('*[core-include]')[i],
          attrs = inc.attributes,
          newTag = inc.hasAttribute('core-include-tag') ? inc.getAttribute('core-include-tag') : 'div',
          newEl = document.createElement(newTag);

          for (var j = 0; j < attrs.length; j++) {
            if (attrs[j].nodeName.indexOf('core') == -1) {
              newEl.setAttribute(attrs[j].nodeName, attrs[j].nodeValue);
            }
          }

          $$.ajax({
            url: inc.getAttribute('core-include')
          }, function (html) {
            newEl.innerHTML = html;
            inc.parentNode.insertBefore(newEl, inc);
            inc.parentNode.removeChild(inc);

            if (iteration == total) {
              core.loadControllers();
              core.loadLocalScriptTags(newEl);
              core.renderDynamicHtml(newEl);
            }
          });
        })(i, incs.length - 1);
      }
    } else {
      core.loadControllers();
      core.loadLocalScriptTags();
      core.renderDynamicHtml();
    }
  } catch (e) {
    console.error(e);
  }
};


/*= End of Core Page Components =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Core Functionality =
===============================================>>>>>*/

core.updateView = function (page) {
  try {
    $$.ajax({
      url: page.html
    }, function (html) {
      /*----------- Load Page Stylesheets -----------*/
      $$('.stylesheets').innerHTML = '';
      for (var i = 0; i < page.css.length; i++) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = page.css[i];
        $$('.stylesheets').appendChild(link);
      }

      /*----------- Load Page HTML -----------*/
      $$('.container').innerHTML = html;

      /*----------- Load Page JavaScript -----------*/
      $$('.scripts').innerHTML = '';
      if (page.js.length) {
        for (var j = 0; j < page.js.length; j++) {
          var script = document.createElement('script');
          script.src = page.js[j];
          $$('.scripts').appendChild(script);

          /*----------- Load Script Tags in HTML -----------*/
          if (j == page.js.length - 1) {
            script.onload = core.renderIncludes;
          }
        }
      } else {
        core.renderIncludes();
      }

    });
  } catch (e) {
    console.error(e);
  }
};

core.loadPage = function (config) {
  try {
    /*----------- Initialize Variables -----------*/
    var
    pageName = location.hash.slice(2),
    pageData = config.pages[pageName],

    pageAssets = pageData.css.concat(pageData.js),

    numAssets = pageAssets.length,
    numLoaded = 0,

    loadDiv = document.createElement('div'),
    loadEvent;

    if (!pageAssets.length) {
      core.updateView(pageData);
      return;
    }


    /*----------- Initialize Preload Event Handler -----------*/
    if ('CustomEvent' in window) {
      loadEvent = new CustomEvent('pageassetload');
    } else {
      loadEvent = document.createEvent('Event');
      loadEvent.initEvent('pageassetload');
    }


    /*----------- Handle Asset Preload -----------*/
    for (var i = 0; i < pageAssets.length; i++) {
      core.preloadAsset(pageAssets[i], loadDiv, loadEvent);
    }

    loadDiv.addEventListener('pageassetload', function () {
      ++numLoaded;
      if (numLoaded == numAssets) core.updateView(pageData);
    });
  } catch (e) {
    console.error(e);
    try {
      console.log('Page ' + pageName + ' does not exist. Rerouting...');
      core.goToPage('home');
    } catch (e) {
      console.error(e);
    }
  }
};

core.goToPage = function (page) {
  try {
    location.hash = '#/' + page;
  } catch (e) {
    console.error(e);
  }
};

core.eventListeners = function (config) {
  try {
    addEventListener('hashchange', core.loadPage.bind(null, config));
  } catch (e) {
    console.error(e);
  }
};

core.init = function (config) {
  try {
    core.eventListeners(config);

    if (!location.hash) core.goToPage('home');
    else core.loadPage(config);
  } catch (e) {
    console.error(e);
  }
};


/*= End of Core Functionality =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= BNMR Library Function Aliases =
===============================================>>>>>*/

$$.go = core.goToPage;
$$.vars = core.dynamicHtmlProxy;
$$.onload = function (fn) { core.events.listener('core_loaded', fn); };


/*= End of BNMR Library Function Aliases =*/
/*=============================================<<<<<*/



/*=============================================>>>>>
= Initializer =
===============================================>>>>>*/

document.addEventListener('DOMContentLoaded', function () {
  $$.ajax({
    type: 'json',
    url: './config.json'
  }, function (config) {
    try {
      core.controllers = {};

      core.events.load = core.events.init('core_loaded');

      $$.allNav = core.navigation.bind(null, config, 'all');
      $$.nav = core.navigation.bind(null, config, 'nav');
      $$.subnav = core.navigation.bind(null, config, 'subnav');

      core.init(config);
    } catch (e) {
      console.error(e);
      throw 'Danger! Danger, Will Robinson! ' + e.message;
    }
  })
});


/*= End of Initializer =*/
/*=============================================<<<<<*/
