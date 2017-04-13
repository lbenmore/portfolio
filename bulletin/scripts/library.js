// JavaScript Document

bnmr.vars = {};
bnmr.fns = {};

bnmr.fns.addNote = function () {
  var _note = bnmr.$('.add__input').value,
      _user_id = atob(bnmr.vars.user_id),
      _params;

  _params = 'user_id=' + _user_id + '&note=' + _note;
  bnmr.ajax({
    'method': 'POST',
    'url': './utilities/?action=add'
  }, function (data) {
    bnmr.$('.board__notes').innerHTML = '';
    bnmr.ajax({
      'method': 'POST',
      'type': 'json',
      'url': './utilities/?action=load'
    }, function (data) {
      bnmr.$('.add__input').value = '';
      bnmr.$('.add__input').focus();
      bnmr.fns.loadBoard(data);
    }, _params);
  }, _params);
};

bnmr.fns.loadBoard = function (data) {
  var username = data[0], notes = data.slice(2, data.length);
  bnmr.vars.user_id = btoa(data[1]);

  window.location.hash = 'board';

  bnmr.$('.board__welcome').innerHTML = 'Welcome, ' + username;

  for (var i = 0; i < notes.length; i++) {
    var note = document.createElement('div');
    note.className = 'notes__note';
    note.innerHTML = notes[i];
    
    bnmr.$('.board__notes').appendChild(note);
  }
};

bnmr.fns.clearInvalidCredentials = function () {
  for (var i = 0; i < bnmr.$('.credentials__input').length; i++) {
    bnmr.$('.credentials__input')[i].className = bnmr.$('.credentials__input')[i].className.replace('invalid', '');
  }
};

bnmr.fns.setInvalidCredentials = function (parentEl) {
  for (var i = 0; i < parentEl.length; i++) {
    bnmr.vars.input = parentEl[i].className.replace(/ /g, '.');
    (function () {
      if (bnmr.$('.' + bnmr.vars.input).value == '') {
        bnmr.log('invalid');
        bnmr.$('.' + bnmr.vars.input).addClass('invalid');
      } else {
        bnmr.log('valid');
        bnmr.$('.' + bnmr.vars.input).removeClass('invalid');
      }
    }());
  }
};

bnmr.fns.login = function (e) {
  var _username = bnmr.$('.credentials__input--login.credentials__input--username').value,
      _password = bnmr.$('.credentials__input--login.credentials__input--password').value,
      _params;

  bnmr.fns.clearInvalidCredentials();

  if (_username == '' || _password == '') {
    bnmr.fns.setInvalidCredentials(bnmr.$('.credentials__input--login'));
  } else {
    _params = 'username=' + _username + '&password=' + _password;
    bnmr.ajax({
      'method': 'POST',
      'url': './utilities/?action=login'
    }, function (data) {
      _params = 'user_id=' + data;
      switch (true) {
        case (data.indexOf('Username does not exist') > -1):
          bnmr.$('.credentials__input--login.credentials__input--username').addClass('invalid');
        break;

        case (data.indexOf('Password does not match') > -1):
          bnmr.$('.credentials__input--login.credentials__input--password').addClass('invalid');
        break;

        default:
          bnmr.ajax({
            'method': 'POST',
            'url': './utilities/?action=load',
            'type': 'json'
          }, function (data) {
            bnmr.fns.loadBoard(data);
          }, _params);
        break;
      }
    }, _params);
  }
};

bnmr.fns.register = function (e) {
  var _fullname = bnmr.$('.credentials__input--register.credentials__input--fullname').value,
      _username = bnmr.$('.credentials__input--register.credentials__input--username').value,
      _password = bnmr.$('.credentials__input--register.credentials__input--password').value,
      _confirm = bnmr.$('.credentials__input--register.credentials__input--confirm').value,
      _params;

  bnmr.fns.clearInvalidCredentials();

  if (_fullname == '' || _username == '' || _password == '' || _confirm == '') {
    bnmr.fns.setInvalidCredentials(bnmr.$('.credentials__input--register'));
  } else if (_password != _confirm) {
      bnmr.$('.credentials__input--register.credentials__input--password').addClass('invalid');
      bnmr.$('.credentials__input--register.credentials__input--confirm').addClass('invalid');
  } else {
   _params = 'fullname=' + _fullname + '&username=' + _username + '&password=' + _password;
    bnmr.ajax({
      'method': 'POST',
      'url': './utilities/?action=register'
    }, function (data) {
      if (data.indexOf('already exists') > -1) {
        bnmr.log(data);
        bnmr.$('.credentials__input--register.credentials__input--username').addClass('invalid');
      } else {
        bnmr.log(data);
      }
    }, _params);
  }
};

bnmr.fns.eventListeners = function () {
  bnmr.$('.credentials__button--register').onclick = bnmr.fns.register;
  bnmr.$('.credentials__button--login').onclick = bnmr.fns.login;
  bnmr.$('.add__submit').onclick = bnmr.fns.addNote;
};

bnmr.fns.initFns = function () {
  bnmr.log('Loaded.');

  switch (window.location.hash) {
    case '#login':
    case '#register':
    break;

    case '#board':
      window.location.hash = '#login';
    break;

    default:
      window.location.hash = '#register';
    break;
  }

  document.getElementsByTagName('input')[0].focus();

  bnmr.fns.eventListeners();
};

bnmr.fns.loader = function () {
  if (bnmr) {
    clearInterval(bnmr.vars.loader);
    bnmr.fns.initFns();
  }
};

document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    bnmr.vars.loader = setInterval(bnmr.fns.loader, 100);
  }
};
