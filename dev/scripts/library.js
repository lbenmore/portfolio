// JavaScript Document

let bnmr = {};
bnmr.vars = {};
bnmr.fns = {};

bnmr.vars.project = 'Portfolio';
bnmr.vars.version = '1.0.0';
bnmr.vars.debugg = true;

bnmr.fns.log = (msg, caller, type) => {
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

bnmr.fns.initCards = () => {
  $$.ajax({
    'type': 'json',
    'url': './scripts/projects.json'
  }, (projects) => {
    bnmr.fns.log('Projects retrieved', 'initCards');
    for (let project of projects) {
      bnmr.fns.log(project, 'initCards Project:');
      let card = document.createElement('div');
      card.className = 'projects__card';
      $$('.content__projects').appendChild(card);

        let header = document.createElement('header');
        header.className = 'card__header';
        card.appendChild(header);

          let title = document.createElement('h1');
          title.className = 'card__title';
          title.innerHTML = project.name;
          header.appendChild(title);

          let technologies = document.createElement('h2');
          technologies.className = 'card__subtitle';
          technologies.innerHTML = '<em>Technologies: ' + project.technologies + '</em>';
          header.appendChild(technologies);

          let browsers = document.createElement('h2');
          browsers.className = 'card__subtitle';
          browsers.innerHTML = '<em>Browsers: ' + project.browsers + '</em>';
          header.appendChild(browsers);

        let description = document.createElement('section');
        description.className = 'card__description';
        description.innerHTML = project.description;
        card.appendChild(description);

        let links = document.createElement('section');
        links.className = 'card__links';
        card.appendChild(links);

          for (let link of project.links) {
            let button = document.createElement('a');
            button.className = 'links__button';
            button.innerHTML = link.name;
            button.setAttribute('href', link.url);
            button.setAttribute('target', '_blank');
            links.appendChild(button);
          }
    }
  });
};


bnmr.fns.eventListeners = () => {

};

bnmr.fns.initFns = () => {
  bnmr.fns.log('Begin initialization', 'initFns');

  bnmr.fns.eventListeners();
  bnmr.fns.initCards();
};

const libraryLoadInterval = setInterval(() => {
  bnmr.fns.log('Loading...', 'libraryLoadInterval');
  if ($$) {
    clearInterval(libraryLoadInterval);
    bnmr.fns.initFns();
  }
}, 100);
