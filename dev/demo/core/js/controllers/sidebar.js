core.controllers.Sidebar = function () {
  var subnav = $$.subnav();

  $$('.sidebar__nav').innerHTML = '';

  if (subnav) {
    $$('body').dataset.sidebarCollapsed = 'false';

    for (var i = 0; i < subnav.length; i++) {
      var
      link = subnav[i],
      li = document.createElement('li');

      li.classList.add('sidebar__link');
      if (i != 0) li.classList.add('m-t-sm');
      li.innerHTML = '<a>' + link.name + '</a>';
      li.addEventListener('click', $$.go.bind(core, link.page));

      $$('.sidebar__nav').appendChild(li);
    }
  } else {
    $$('body').dataset.sidebarCollapsed = 'true';
  }
};
