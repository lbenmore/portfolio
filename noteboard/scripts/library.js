// JavaScript Document

bnmr.vars = {};
bnmr.fns = {};

bnmr.fns.setCookie = function (status, username, password) {
  document.cookie = 'bnmr_logged_in=' + status;
  document.cookie = 'username=' + btoa(username);
  document.cookie = 'password=' + btoa(password);
};

bnmr.fns.inputReturnHandler = function (e) {
  if (e.keyCode == 13) {
    switch (e.target) {
      case bnmr.$('.credentials__input--register.credentials__input--fullname'):
      case bnmr.$('.credentials__input--register.credentials__input--username'):
      case bnmr.$('.credentials__input--register.credentials__input--password'):
        e.target.nextElementSibling.nextElementSibling.focus();
      break;

      case bnmr.$('.credentials__input--register.credentials__input--confirm'):
        bnmr.fns.register();
      break;

      case bnmr.$('.credentials__input--login.credentials__input--username'):
        e.target.nextElementSibling.nextElementSibling.focus();
      break;

      case bnmr.$('.credentials__input--login.credentials__input--password'):
        bnmr.fns.login();
      break;

      case bnmr.$('.add__input'):
        bnmr.fns.addNote();
      break;

      default:
      break;
    }
  }
}

bnmr.fns.loadBoard = function (data) {
  var _fullname = data['fullname'], _userId = data['user_id'], _notes = data['notes']
  bnmr.vars.userId = btoa(_userId);

  window.location.hash = 'board';

  bnmr.$('.welcome__msg').innerHTML = 'Welcome, ' + _fullname;

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

  if (bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen.remove();
    bnmr.vars.loadScreen = null;
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

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

  bnmr.ajax({
    'method': 'POST',
    'url': './utilities/?action=clear'
  }, function (data) {
    bnmr.fns.updateNotes();
  }, _params);
}

bnmr.fns.deleteNote = function (e) {
  var _userId = atob(bnmr.vars.userId),
  _noteId = atob(e.target.getAttribute('data-note-id')),
  _params = 'user_id=' + _userId + '&note_id=' + _noteId;

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

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

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

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

bnmr.fns.logout = function () {
  bnmr.fns.setCookie(false, '', '');
  
  bnmr.$('.credentials__input--login.credentials__input--username').value = '';
  bnmr.$('.credentials__input--login.credentials__input--password').value = '';

  window.location.hash = '#login';
}

bnmr.fns.login = function () {
  var _username = bnmr.$('.credentials__input--login.credentials__input--username').value,
      _password = bnmr.$('.credentials__input--login.credentials__input--password').value,
      _userId,
      _params;

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

  bnmr.fns.clearInvalidCredentials();

  if (_username == '' || _password == '') {
    bnmr.fns.setInvalidCredentials(bnmr.$('.credentials__input--login'));
  } else {
    _params = 'username=' + _username + '&password=' + _password;
    bnmr.ajax({
      'method': 'POST',
      'url': './utilities/?action=login'
    }, function (data) {
      _userId = data;
      _params = 'user_id=' + _userId;
      switch (true) {
        case (data.indexOf('Username does not exist') > -1):
          bnmr.$('.credentials__input--login.credentials__input--username').addClass('invalid');
        break;

        case (data.indexOf('Password does not match') > -1):
          bnmr.$('.credentials__input--login.credentials__ihttp://lisabenmore.com/bulletin/#loginnput--password').addClass('invalid');
        break;

        default:
          bnmr.ajax({
            'method': 'POST',
            'url': './utilities/?action=load',
            'type': 'json'
          }, function (data) {
            bnmr.fns.loadBoard(data);
          }, _params);
          bnmr.fns.setCookie('true', _username, _password);
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

   bnmr.vars.loadScreen = new bnmr.loadScreen();

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
  bnmr.$('.welcome__logout').onclick = bnmr.fns.logout;

  for (var i = 0; i < bnmr.$('input').length; i++) {
    bnmr.$('input')[i].onkeypress = bnmr.fns.inputReturnHandler;
  }
};

bnmr.fns.initFns = function () {
  if (bnmr.readCookie('bnmr_logged_in') == 'true') {
    bnmr.$('.credentials__input--login.credentials__input--username').value = atob(bnmr.readCookie('username'));
    bnmr.$('.credentials__input--login.credentials__input--password').value = atob(bnmr.readCookie('password'));
    bnmr.fns.login();
  } else {
    switch (window.location.hash) {
      case '#register':
        window.location.hash = '#register';
      break;

      case '#login':
        window.location.hash = '#login';
      break;

      case '#board':
        window.location.hash = '#login';
      break;

      default:
        window.location.hash = '#login';
      break;
    }
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
