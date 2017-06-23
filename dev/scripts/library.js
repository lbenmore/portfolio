// JavaScript Document

let bnmr = {};
bnmr.globals = {};
bnmr.fns = {};

bnmr.fns.initMenu = () => {
  $$.ajax({
    type: 'json',
    url: './assets/projects.json'
  }, (projects) => {
    $$('.projects').removeChild($$('.projects__list'));
    let list = document.createElement('div');
    list.classList.add('projects__list');
    $$('.projects').appendChild(list);

    for (let project of projects) {
      let item = document.createElement('div');
      item.classList.add('projects__item');
      list.appendChild(item);

      	let title = document.createElement('div');
    		title.classList.add('projects__name');
      	title.innerHTML = project.name;
      	item.appendChild(title);

      	let tech = document.createElement('div');
      	tech.classList.add('projects__technologies');
      	tech.innerHTML = `Technologies: ${project.technologies}`;
      	item.appendChild(tech);

      	let browsers = document.createElement('div');
      	browsers.classList.add('projects__browsers');
      	browsers.innerHTML = `Supported browsers: ${project.browsers}`;
      	item.appendChild(browsers);

      	let desc = document.createElement('div');
      	desc.classList.add('projects__description');
      	desc.innerHTML = project.description;
      	item.appendChild(desc);

    		for (let link of project.links) {
          let btn = document.createElement('a');
          btn.classList.add('projects__btn');
          btn.href = link.url;

            let highlight = document.createElement('span');
            highlight.classList.add('projects__btn-highlight');
            btn.appendChild(highlight);

            let copy = document.createElement('span');
            copy.classList.add('projects__btn-copy');
          	copy.innerHTML = link.name;
            btn.appendChild(copy);
          item.appendChild(btn);
        }
    }
  });
};

bnmr.fns.initFns = () => {
  $$.log('hello, world.');

  bnmr.fns.initMenu();
};

document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    bnmr.fns.initFns();
  }
};
