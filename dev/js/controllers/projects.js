core.controllers.Projects = () => {
  const
  animProjects = () => {
    $$('.card').forEach((card) => {
      setTimeout(() => {
        card.classList.remove('opac-0');
      }, ((parseInt(card.dataset.row) + parseInt(card.dataset.col)) * 150) + 250);
    });
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
        } else ++col;
      } else if (524 < innerWidth || innerWidth <= 768) {
        if ((i + 1) % 2 == 0) {
          col = 0;
          ++row;
        } else ++col;
      } else if (innerWidth <= 524) {
        // ¯\_(ツ)_/¯
      }

      return `
        <div class="card m-b p bkg-secondary opac-0" data-row="${y}" data-col="${x}" style="background-image: url('${project.thumbnail}')">
          <h1 class="card__title m-b">${project.name}</h1>
          <div class="card__thumb m-b" style="background-image: url('${project.thumbnail}')"></div>
          <p class="card__description m-b">
            ${project.description}
          </p>
          <ul class="list-style-none">
            ${
              project.links.map((link) => {
                return `<li class="card__link"><a href="${link.url}" target="${link.url.slice(0, 1) == '#' ? '_self' : '_blank'}">${link.name}</a></li>`;
              }).join('')
            }
          </ul>
        </div>
      `;
    }).join('');

    animProjects();
  },

  setSectionFiller = (projects) => {
    if (768 < innerWidth) {
      if (projects.length % 5 == 0) $$('section').classList.add('filler');
    } else if (524 < innerWidth || innerWidth <= 768) {
      $$('section').classList.remove('filler');
    } else if (innerWidth <= 524) {
      $$('section').classList.remove('filler');
    }
  },

  initProjectsFns = () => {
    $$.ajax({
      type: 'json',
      url: './assets/json/projects.json',
      callback: (projects) => {
        writeProjects(projects, $$('section'));
        setSectionFiller(projects);
        addEventListener('resize', setSectionFiller.bind(null, projects));
      }
    })
  };

  if ($$.loaded) {
    initProjectsFns();
  } else {
    addEventListener('LOAD_EVENT', initProjectsFns);
  }
};
