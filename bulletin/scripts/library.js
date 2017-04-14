// JavaScript Document

bnmr.vars = {};
bnmr.fns = {};

bnmr.fns.loadBoard = function (data) {
  var _fullname = data['fullname'], _userId = data['user_id'], _notes = data['notes']
  bnmr.vars.userId = btoa(_userId);

  window.location.hash = 'board';

  bnmr.$('.board__welcome').innerHTML = 'Welcome, ' + _fullname;

  for (var note in _notes) {
    (function () {
      var _noteId = note, _noteText = _notes[note];

      var _note = document.createElement('div');
      _note.className = 'notes__note';
      _note.innerHTML = _noteText;

      var _delete = document.createElement('span');
      _delete.className = 'note__delete';
      _delete.setAttribute('data-note-id', btoa(_noteId));
      _delete.innerHTML = 'x';

      _delete.onclick = bnmr.fns.deleteNote;

      _note.appendChild(_delete);
      bnmr.$('.board__notes').appendChild(_note);
    })();
  }
};

bnmr.fns.updateNotes = function () {
  var _userId = atob(bnmr.vars.userId),
  _params = 'user_id=' + _userId;

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
};

bnmr.fns.clearNotes = function () {
  var _userId = atob(bnmr.vars.userId),
  _params = 'user_id=' + _userId;
  bnmr.log(_params);
  bnmr.ajax({
    'method': 'POST',
    'url': './utilities/?action=clear'
  }, function (data) {
    bnmr.log(data);

    bnmr.fns.updateNotes();
  }, _params);
}

bnmr.fns.deleteNote = function (e) {
  var _userId = atob(bnmr.vars.userId),
  _noteId = atob(e.target.getAttribute('data-note-id')),
  _params = 'user_id=' + _userId + '&note_id=' + _noteId;

  bnmr.ajax({
    'method': 'POST',
    'url': './utilities/?action=delete'
  }, function (data) {
      bnmr.fns.updateNotes();
  }, _params);
};

bnmr.fns.addNote = function () {
  var _note = bnmr.$('.add__input').value,
      _userId = atob(bnmr.vars.userId),
      _params;

  _params = 'user_id=' + _userId + '&note=' + _note;
  bnmr.ajax({
    'method': 'POST',
    'url': './utilities/?action=add'
  }, function (data) {
      bnmr.fns.updateNotes();
  }, _params);
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
        bnmr.$('.' + bnmr.vars.input).addClass('invalid');
      } else {
        bnmr.$('.' + bnmr.vars.input).removeClass('invalid');
      }
    }());
  }
};

bnmr.fns.login = function () {
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
        bnmr.$('.credentials__input--register.credentials__input--username').addClass('invalid');
      } else {
        bnmr.$('.credentials__input--login.credentials__input--username').value = _username;
        bnmr.$('.credentials__input--login.credentials__input--password').value = _password;
        bnmr.fns.login();
      }
    }, _params);
  }
};

bnmr.fns.eventListeners = function () {
  bnmr.$('.credentials__button--register').onclick = bnmr.fns.register;
  bnmr.$('.credentials__button--login').onclick = bnmr.fns.login;
  bnmr.$('.add__submit').onclick = bnmr.fns.addNote;
  bnmr.$('.add__clear').onclick = bnmr.fns.clearNotes;
};

bnmr.fns.setCookie = function () {
  bnmr.vars.cookie = document.cookie;
};

bnmr.fns.readCookie = function () {
  bnmr.vars.cookie = document.cookie;
  if (!bnmr.vars.cookie || bnmr.vars.cookie == '') {
    bnmr.fns.setCookie();
  }
};

bnmr.fns.initFns = function () {
  switch (window.location.hash) {
    case '#register':
    break;

    default:
      window.location.hash = '#login';
    break;
  }

  document.getElementsByTagName('input')[0].focus();

  bnmr.fns.readCookie();
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
