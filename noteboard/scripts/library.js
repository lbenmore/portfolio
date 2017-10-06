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
};

bnmr.fns.deleteFile = function (fileName) {
  var _userId = atob(bnmr.vars.userId),
  _params = new FormData();

  _params.append('action', 'delete_file');
  _params.append('user_id', _userId);
  _params.append('file_name', fileName);

  bnmr.ajax({
    type: 'json',
    method: 'POST',
    url: './utilities/',
    params: _params
  }, bnmr.fns.listFiles);
};

bnmr.fns.downloadFile = function (fileName) {
  var link = document.createElement('a');
  link.setAttribute('download', fileName);
  link.setAttribute('href', './uploads/' + atob(bnmr.vars.userId) + '/' + fileName);
  link.click();
};

bnmr.fns.handleXHRProgress = function (e) {
  var loaded = e.loaded,
  total = e.total,
  perc = Math.floor(loaded / total * 100);

  bnmr.$('.upload__progress').style.setProperty('--prog', perc + '%');
};

bnmr.fns.handleFileUpload = function (e) {
  var _files = e.target.files,
  _userId = atob(bnmr.vars.userId),
  _fileNames = [],
  _curr = 1;
  _total = _files.length;

  for (var i = 0; i < _files.length; i++) {
    var _params = new FormData();
    _params.append('action', 'upload_file');
    _params.append('user_id', _userId);
    _params.append('file', _files[i]);
    _params.append('file_name', _files[i].name);

    _fileNames.push(_files[i].name);

    bnmr.ajax({
      type: 'json',
      method: 'POST',
      url: './utilities/',
      params: _params,
      progress: bnmr.fns.handleXHRProgress
    }, function () {
      _curr == _total ? bnmr.fns.listFiles() : _curr++;
    });
  }

  bnmr.$('.upload__label').setAttribute('data-content', _fileNames.join('\n'));
};

bnmr.fns.handleFileDnD = function (e) {
  switch (e.type) {
    case 'dragenter':
      bnmr.$('.upload__label').addClass('active');
    break;

    case 'dragleave':
    case 'drop':
      bnmr.$('.upload__label').removeClass('active');
    break;
  }
};

bnmr.fns.listFiles = function () {
  var _userId = atob(bnmr.vars.userId),
  _params = new FormData();

  bnmr.$('.files__list').innerHTML = '';
    bnmr.$('.upload__progress').style.setProperty('--prog', '0%');
    bnmr.$('.upload__label').setAttribute('data-content', 'Click Here to Select or \nDrag Files Here to Upload');

  _params.append('action', 'list_files');
  _params.append('user_id', _userId);

  bnmr.ajax({
    type: 'json',
    method: 'POST',
    url: './utilities/',
    params: _params
  }, function (data) {
    var _files = data.files.split(',');
    if (_files.length && _files[0] != "") {
      for (var i = 0; i < _files.length; i++) {
        var li = document.createElement('li'),
        btnDelete = document.createElement('button'),
        btnDownload = document.createElement('button');

        li.innerHTML = bnmr.truncate(_files[i], 30);
        li.classList.add('list__item');
        bnmr.$('.files__list').appendChild(li);

        btnDelete.innerHTML = 'x';
        btnDelete.onclick = bnmr.fns.deleteFile.bind(null, _files[i]);
        btnDownload.innerHTML = '&darr;';
        btnDownload.onclick = bnmr.fns.downloadFile.bind(null, _files[i]);
        li.appendChild(btnDelete);
        li.appendChild(btnDownload);
      }
    }
  });
};

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

  bnmr.fns.listFiles();

  if (bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen.remove();
    bnmr.vars.loadScreen = null;
  }
};

bnmr.fns.updateNotes = function () {
  var _userId = atob(bnmr.vars.userId),
  _params = new FormData();

  _params.append('action', 'load');
  _params.append('user_id', _userId);

  bnmr.$('.board__notes').innerHTML = '';
  bnmr.ajax({
    method: 'POST',
    type: 'json',
    url: './utilities/',
    params: _params
  }, function (data) {
    bnmr.$('.add__input').value = '';
    bnmr.$('.add__input').focus();
    bnmr.fns.loadBoard(data);
  });
};

bnmr.fns.clearNotes = function () {
  var _userId = atob(bnmr.vars.userId),
  _params = new FormData();

  _params.append('action', 'clear');
  _params.append('user_id', _userId);

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

  bnmr.ajax({
    method: 'POST',
    url: './utilities/',
    params: _params
  }, function (data) {
    bnmr.fns.updateNotes();
  });
}

bnmr.fns.deleteNote = function (e) {
  var _userId = atob(bnmr.vars.userId),
  _noteId = atob(e.target.getAttribute('data-note-id')),
  _params = new FormData();

  _params.append('action', 'delete');
  _params.append('user_id', _userId);
  _params.append('note_id', _noteId);

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

  bnmr.ajax({
    method: 'POST',
    url: './utilities/',
    params: _params
  }, function (data) {
      bnmr.fns.updateNotes();
  });
};

bnmr.fns.addNote = function () {
  var _note = bnmr.$('.add__input').value,
      _userId = atob(bnmr.vars.userId),
      _params = new FormData();

  _params.append('action', 'add');
  _params.append('user_id', _userId);
  _params.append('note', _note);

  if (!bnmr.vars.loadScreen) {
    bnmr.vars.loadScreen = new bnmr.loadScreen();
  }

  bnmr.ajax({
    method: 'POST',
    url: './utilities/',
    params: _params
  }, function (data) {
      bnmr.fns.updateNotes();
  });
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

  bnmr.vars.userId = null;

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
    _params = new FormData();

    _params.append('action', 'login');
    _params.append('username', _username);
    _params.append('password', _password);

    bnmr.ajax({
      method: 'POST',
      url: './utilities/',
      params: _params
    }, function (data) {
      _userId = data;
      _params = 'user_id=' + _userId;

      bnmr.vars.userId = btoa(_userId);

      switch (true) {
        case (data.indexOf('Username does not exist') > -1):
          bnmr.$('.credentials__input--login.credentials__input--username').addClass('invalid');
        break;

        case (data.indexOf('Password does not match') > -1):
          bnmr.$('.credentials__input--login.credentials__ihttp://lisabenmore.com/bulletin/#loginnput--password').addClass('invalid');
        break;

        default:
          bnmr.fns.setCookie('true', _username, _password);
          bnmr.fns.updateNotes();
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
   _params = new FormData();

   _params.append('action', 'register');
   _params.append('fullname', _fullname);
   _params.append('username', _username);
   _params.append('password', _password);

   bnmr.vars.loadScreen = new bnmr.loadScreen();

    bnmr.ajax({
      method: 'POST',
      url: './utilities/',
      params: _params
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

  bnmr.$('.upload__input').ondragenter = bnmr.fns.handleFileDnD;
  bnmr.$('.upload__input').ondragleave = bnmr.fns.handleFileDnD;
  bnmr.$('.upload__input').ondrop = bnmr.fns.handleFileDnD;

  bnmr.$('.upload__input').onchange = bnmr.fns.handleFileUpload;
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
