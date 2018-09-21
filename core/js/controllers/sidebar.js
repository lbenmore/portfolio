var

populateNav = function () {
  var
  page = window.location.hash.slice(2),
  nav = config.nav[config.pages[page].nav];

  $$('.sidebar ul').innerHTML = '';

  for (var i = 0; i < nav.length; i++) {
    var li = document.createElement('li');
    li.setAttribute('onclick', 'go("' + nav[i].page + '")');
    li.innerHTML = nav[i].title;
    li.classList.add('cursor-pointer');
    $$('.sidebar ul').appendChild(li);
  }
},

initNav = function () {
  if ($$('.sidebar ul').appendChild) {
    populateNav();
  } else {
    setTimeout(initNav, 100);
  }
};

initNav();
