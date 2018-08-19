var
initSubNav = function () {
  var
  page = window.location.hash.slice(2),
  subnav = config.subnav[config.pages[page].subnav];

  if (subnav) {
      if ($$('.sidebar__list').appendChild) {
        $$('.sidebar__list').innerHTML = '';

        for (var i = 0; i < subnav.length; i++) {
          var
          li = document.createElement('li'),
          span = document.createElement('span');

          if (page == subnav[i].page) {
            li.classList.add('active');
            li.dataset.isExpanded = 'true';
          }
          li.classList.add('m-b');
          $$('.sidebar__list').appendChild(li);

          span.innerHTML = subnav[i].title;
          span.setAttribute('onclick', 'go("' + subnav[i].page + '")');
          li.appendChild(span);

          if (subnav[i].subsubnav) {
            var
            subUl = document.createElement('ul'),
            subsubnav = config.subsubnav[subnav[i].subsubnav];

            li.classList.add('expandable');

            subUl.classList.add('p-l');
            li.appendChild(subUl);

            for (var j = 0; j < subsubnav.length; j++) {
              var subLi = document.createElement('li');

              if (page == subsubnav[j].page) {
                subLi.classList.add('active');
                li.dataset.isExpanded = 'true';
              }
              subLi.innerHTML = subsubnav[j].title;
              subLi.classList.add('m-t');
              subLi.setAttribute('onclick', 'go("' + subsubnav[j].page + '")');
              subUl.appendChild(subLi);
            }
          }
        }
    } else {
      setTimeout(initSubNav, 100);
    }
  }
};
