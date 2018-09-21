initSubnav = function () {
  var
  page = window.location.hash.slice(2),
  subnav = config.subnav[config.pages[page].subnav];

  for (var i = 0; i < subnav.length; i++) {
    var li = document.createElement('li');
    li.setAttribute('onclick', 'go("' + subnav[i].page + '")');
    li.innerHTML = subnav[i].title;
    li.classList.add('cursor-pointer');
    $$('.sidebar ul').appendChild(li);
  }
};
