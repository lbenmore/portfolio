// JavaScript Document

var bnmr = {};
bnmr.vars = {};
bnmr.fns = {};

bnmr.vars.project = 'Portfolio';
bnmr.vars.version = '1.0.0';
bnmr.vars.debugg = true;

bnmr.fns.log = function (msg, caller, type) {
  type = type || 'log';
  caller = caller || 'unknown';

  if (bnmr.vars.debugg) {
    if (typeof msg == 'string' || !window.console.dir) {
      console[type](bnmr.vars.project + ' :: ' + bnmr.vars.version + ' :: ' + caller + ' :: ' + msg);
    } else {
      console[type](bnmr.vars.project + ' :: ' + bnmr.vars.version + ' :: ' + caller);
      console.dir(msg);
    }
  }
};

bnmr.fns.initCards = function () {
  $$.ajax({
    'type': 'json',
    'url': './scripts/projects.json'
  }, function (projects) {
    bnmr.fns.log('Projects retrieved', 'initCards');
    for (var i = 0; i < projects.length; i++) {
      bnmr.fns.log(projects[i], 'initCards Project:');

      var card = document.createElement('div');
      card.className = 'projects__card';
      $$('.content__projects').appendChild(card);

        var header = document.createElement('header');
        header.className = 'card__header';
        card.appendChild(header);

          var title = document.createElement('h1');
          title.className = 'card__title';
          title.innerHTML = projects[i].name;
          header.appendChild(title);

          var technologies = document.createElement('h2');
          technologies.className = 'card__subtitle';
          technologies.innerHTML = '<em>Technologies: ' + projects[i].technologies + '</em>';
          header.appendChild(technologies);

          var browsers = document.createElement('h2');
          browsers.className = 'card__subtitle';
          browsers.innerHTML = '<em>Browsers: ' + projects[i].browsers + '</em>';
          header.appendChild(browsers);

        var description = document.createElement('section');
        description.className = 'card__description';
        description.innerHTML = projects[i].description;
        card.appendChild(description);

        var links = document.createElement('section');
        links.className = 'card__links';
        card.appendChild(links);

          for (var j = 0; j < projects[i].links.length; j++) {
            var button = document.createElement('button');
            button.className = 'links__button';
            button.innerHTML = projects[i].links[j].name;
            button.setAttribute('data-link', projects[i].links[j].url);
            links.appendChild(button);

            button.onclick = function (e) {
              window.open(e.target.getAttribute('data-link'), '_blank');
            };
          }
    }
  });
};

bnmr.fns.eventListeners = function () {

};

bnmr.fns.initFns = function () {
  bnmr.fns.log('Begin initialization', 'initFns');

  bnmr.fns.eventListeners();
  bnmr.fns.initCards();
};

var libraryLoadInterval = setInterval(function () {
  bnmr.fns.log('Loading...', 'libraryLoadInterval');
  if ($$) {
    clearInterval(libraryLoadInterval);
    bnmr.fns.initFns();
  }
}, 100);
