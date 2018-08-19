var
initMenu = function () {
  if ($$('.sidebar ul').appendChild) {
    initSubnav();
  } else {
    setTimeout(initMenu, 100);
  }
}

initFns = function () {
  initMenu();
};

initFns();
