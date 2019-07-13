core.controllers.Projects = () => {
  const
  animProjects = () => {
    $$('.card').forEach((card) => {
      setTimeout(() => {
        card.classList.remove('opac-0');
        card.classList.remove('scale-075');
      }, ((parseInt(card.dataset.row) + parseInt(card.dataset.col)) * 150) + 250);
    });
  },

  setSectionFiller = (projects) => {
    if (768 < innerWidth) {
      if ((projects.length + 1) % 3 == 0) $$('section').classList.add('filler');
    } else if (524 < innerWidth || innerWidth <= 768) {
      $$('section').classList.remove('filler');
    } else if (innerWidth <= 524) {
      $$('section').classList.remove('filler');
    }
  },

  writeProjects = (projects, target) => {
    let row = 0, col = 0;

    target.classList.add('flex');
    target.classList.add('wrap');
    target.classList.add('justify-space-between');
    target.innerHTML = projects.map((project, i) => {
      let
      x = col,
      y = row;

      if (768 < innerWidth) {
        if ((i + 1) % 3 == 0) {
          col = 0;
          ++row;
        }
        else ++col;
      } else if (524 < innerWidth && innerWidth <= 768) {
        if ((i + 1) % 2 == 0) {
          col = 0;
          ++row;
        }
        else ++col;
      } else if (innerWidth <= 524) {
        ++row;
      }

      return `
        <div class="card m-b p bg-secondary opac-0 scale-075 overflow-hidden" data-row="${y}" data-col="${x}" style="background-image: url('${project.image}')">
          <h1 class="card__title m-b font-size-md l-s-0-2 text-align-center t-t-u">${project.name}</h1>
          <div class="card__thumb m-b w-full" style="background-image: url('${project.image}')"></div>
          <p class="card__description m-b">
            ${project.description}
          </p>
          <ul class="list-style-none">
            ${
              project.links.map((link) => {
                return `<li class="card__link l-h-2"><a href="${link.url}" target="${link.url.slice(0, 1) == '#' ? '_self' : '_blank'}">${link.name}</a></li>`;
              }).join('')
            }
          </ul>
        </div>
      `;
    }).join('');

    animProjects();
  },

  initFns = () => {
		/*
  	const xhr = new XMLHttpRequest();
  	
  	xhr.onload = () => {
  		try {
				const projects = JSON.parse(xhr.response);
        const imgs = projects.map((proj) => proj.image);
        $$.preload(imgs, () => {
          writeProjects(projects, $$('section'));
          setSectionFiller(projects);
          addEventListener('resize', setSectionFiller.bind(null, projects));
        });
  		} catch (e) {
  			console.error(e);
  		}
  	};
  	
  	xhr.open('GET', './assets/json/projects.json', true);
  	xhr.send();
  	
  	return;
  	*/
  
    $$.ajax({
      type: 'json',
      url: './assets/json/projects.json',
      callback: (projects) => {
        const imgs = projects.map((proj) => proj.image);
        $$.preload(imgs, () => {
          writeProjects(projects, $$('section'));
          setSectionFiller(projects);
          addEventListener('resize', setSectionFiller.bind(null, projects));
        });
      }
    })
  };

  if (core.isLoaded()) {
    initFns();
  } else {
    core.events.addEventListener('load', initFns, {once: true});
  }
};
