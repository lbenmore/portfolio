// JavaScript Document

bnmr.vars = {};
bnmr.fns = {};

bnmr.fns.validateRegister = function (e) {
  var name = bnmr.$('.register__name').value,
      username = bnmr.$('.register__username').value,
      password = bnmr.$('.register__password').value,
      passwordConfirm = bnmr.$('.register__passwordConfirm').value;

  if (!name || !username || !password || !passwordConfirm) {
    e.preventDefault();
    bnmr.log('Please fill out all fields. \n');
    alert('Please fill out all fields.');
  }

  if (password != passwordConfirm) {
    e.preventDefault();
    bnmr.log('Password fields do not match. \n');
    alert('Password fields do not match.');
  }
};

bnmr.fns.eventListeners = function () {
  bnmr.$('.register__submit').onclick = bnmr.fns.validateRegister;
};

bnmr.fns.initFns = function () {
  bnmr.log('Loaded.');

  document.getElementsByTagName('input')[0].focus();

  bnmr.fns.eventListeners();
};

bnmr.fns.loader = function () {
  if (bnmr) {
    clearInterval(bnmr.vars.loader);
    bnmr.fns.initFns();
  }
}

document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    bnmr.vars.loader = setInterval(bnmr.fns.loader, 100);
  }
}
