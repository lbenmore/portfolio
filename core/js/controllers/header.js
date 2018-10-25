core.controllers.Header = function () {
  var nav = $$.nav('main'), max = 99;


  function initNav () {
    $$('.header__nav').innerHTML = '';
    for (var i = 0; i < nav.length; i++) {
      var
      link = nav[i],
      li = document.createElement('li');

      li.classList.add('header__item');
      li.classList.add('dsp-inblk');
      if (i != 0) li.classList.add('m-l');
      li.innerHTML = '<a>' + link.name + '</a>';
      li.addEventListener('click', $$.go.bind(core, link.page));

      $$('.header__nav').appendChild(li);
    }
  }

  function load () {
    if ($$('.header__nav').appendChild) {
      initNav();
    } else {
      if (max) {
        setTimeout(load, 100);
        --max;
      }
    }
  }

  load();

  var allNav = $$.allNav();

  for (var item in allNav) {
    for (var i = 0; i < allNav[item].length; i++) {
      var page = allNav[item][i];
      if (page.page == location.hash.slice(2)) {
        $$.vars.pageName = page.name;
        break;
      }
    }
  }
};
