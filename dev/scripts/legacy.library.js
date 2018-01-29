// JavaScript Document

var bnmr = {};
bnmr.globals = {};
bnmr.fns = {};

bnmr.fns.initMobile = function () {
  if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)) {
    var mobileState = 'less'

    $$('.projects').css('height', '100vh');
    $$('.projects').css('overflow', 'hidden');

    var btnMore = document.createElement('div');
    btnMore.className += ' projects__more';
    btnMore.innerHTML = 'MORE';
    $$('.projects').appendChild(btnMore);

    $$('.projects__more').on('tap', function () {
      switch (mobileState) {
        case 'less':
          $$('.projects').css('height', 'auto');
          $$('.projects__more').innerHTML = 'LESS';
          mobileState = 'more';
        break;

        case 'more':
          $$('.projects').css('height', '100vh');
          $$('.projects__more').innerHTML = 'MORE';
          mobileState = 'less';
        break;
      }
    });
  }
};

bnmr.fns.submitContactForm = function () {
  let
  name = $$('.contact__input--name input').value,
  email = $$('.contact__input--email input').value,
  msg = $$('.contact__input--msg textarea').value,
  params = new FormData(),
  valid = true;

  if (!name) {
    $$('.contact__input--name').setAttribute('data-warning', 'Who are you?');
    valid = false;
  } else {
    $$('.contact__input--name').setAttribute('data-warning', '');
  }

  if (!email) {
    $$('.contact__input--email').setAttribute('data-warning', 'Who are you?');
    valid = false;
  } else if (email.indexOf('@') == -1) {
    $$('.contact__input--email').setAttribute('data-warning', 'Real email address, please.');
    valid = false;
  } else if (email.split('@')[1].indexOf('.') == -1) {
    $$('.contact__input--email').setAttribute('data-warning', 'Real email address, please.');
    valid = false;
  } else {
    $$('.contact__input--email').setAttribute('data-warning', '');
  }

  if (!msg) {
    $$('.contact__input--msg').setAttribute('data-warning', 'What, nothing to say?');
    valid = false;
  } else {
    $$('.contact__input--msg').setAttribute('data-warning', '');
  }

  if (valid) {
    $$('.contact__loading').css('display', 'block');

    params.append('name', name);
    params.append('email', email);
    params.append('msg', msg);

    $$.ajax({
      method: 'POST',
      url: '../assets/email.php',
      params: params
    }, function (data) {
      $$('.contact__loading').css('display', 'none');

      $$('.contact__input--name').setAttribute('data-warning', '');
      $$('.contact__input--email').setAttribute('data-warning', '');
      $$('.contact__input--msg').setAttribute('data-warning', '');

      $$('.contact__input--name input').value = '';
      $$('.contact__input--email input').value = '';
      $$('.contact__input--msg textarea').value = '';

      for (var i= 0; i < $$('.contact__input input, .contact__input textarea').length; i++) {
        var input = $$('.contact__input input, .contact__input textarea')[i];

        input.parentNode.className = input.parentNode.className.replace('active', '');
        input.parentNode.className = input.parentNode.className.replace('nonempty', '');
      }
    });
  }
};

bnmr.fns.initContact = function () {
  $$('.contact__list').css('padding-bottom', '4vw');
  $$('.contact__email-link').css('display', 'none');

  var emailForm = document.createElement('div');
  emailForm.className += ' contact__form';
  $$('.contact').insertBefore(emailForm, null);

    var formHeader = document.createElement('h3');
    formHeader.className = 'contact__form-header';
    formHeader.innerHTML = 'Or just hit me up...';
    emailForm.appendChild(formHeader);

    var name = document.createElement('div');
    name.className += ' contact__input contact__input--name';
    name.setAttribute('data-label', 'Your Name');
    emailForm.appendChild(name);

      var nameInput = document.createElement('input');
      nameInput.setAttribute('type', 'text');
      name.appendChild(nameInput);

    var email = document.createElement('div');
    email.className += ' contact__input contact__input--email';
    email.setAttribute('data-label', 'Email Address');
    emailForm.appendChild(email);

      var emailInput = document.createElement('input');
      emailInput.setAttribute('type', 'email');
      email.appendChild(emailInput);

    var msg = document.createElement('div');
    msg.className += ' contact__input contact__input--msg';
    msg.setAttribute('data-label', 'Tell me how you really feel...');
    emailForm.appendChild(msg);

      var msgInput = document.createElement('textarea');
      msgInput.setAttribute('rows', '6');
      msg.appendChild(msgInput);

    var submit = document.createElement('button');
    submit.className += ' contact__submit';
    submit.innerHTML = 'Send';
    submit.onclick = bnmr.fns.submitContactForm;
    emailForm.appendChild(submit);

    var loading = document.createElement('div');
    loading.className += ' contact__loading';
    emailForm.appendChild(loading);

    for (var i = 0; i < $$('.contact__input input, .contact__input textarea').length; i++) {
      var input = $$('.contact__input input, .contact__input textarea')[i];

      input.onfocus = function (e) {
        e.target.parentNode.className += ' active';
      };

      input.onblur = function (e) {
        if (e.target.value == '') {
          e.target.parentNode.classList.remove('active');
          e.target.parentNode.classList.remove('nonempty');
        } else {
          e.target.parentNode.classList.remove('active');
          e.target.parentNode.className += ' nonempty';
        }
      };
    }
};

bnmr.fns.initMenu = function () {
  $$.ajax({
    type: 'json',
    url: './assets/projects.json'
  }, function (projects) {
    $$('.projects').removeChild($$('.projects__list'));
    var list = document.createElement('div');

    list.className += ' projects__list';
    $$('.projects').appendChild(list);

    for (var i = 0; i < projects.length; i++) {
      var project = projects[i];

      var item = document.createElement('div');
      item.className += ' projects__item';
      list.appendChild(item);

      	var title = document.createElement('div');
    		title.className += ' projects__name';
      	title.innerHTML = project.name;
      	item.appendChild(title);

      	var tech = document.createElement('div');
      	tech.className += ' projects__technologies';
      	tech.innerHTML = 'Technologies: ' + project.technologies;
      	item.appendChild(tech);

      	var browsers = document.createElement('div');
      	browsers.className += ' projects__browsers';
      	browsers.innerHTML = 'Supported browsers: ' + project.browsers;
      	item.appendChild(browsers);

      	var desc = document.createElement('div');
      	desc.className += ' projects__description';
      	desc.innerHTML = project.description;
      	item.appendChild(desc);

    		for (var j = 0; j <  project.links.length; j++) {
          var link = project.links[j];

          var btn = document.createElement('a');
          btn.className += ' projects__btn';
          btn.href = link.url;
          btn.target = '_blank';
          item.appendChild(btn);

            var highlight = document.createElement('span');
            highlight.className += ' projects__btn-highlight';
            btn.appendChild(highlight);

            var copy = document.createElement('span');
            copy.className += ' projects__btn-copy';
          	copy.innerHTML = link.name;
            btn.appendChild(copy);
        }
    }
  });
};

bnmr.fns.initFns = function () {
  bnmr.fns.initMenu();
  bnmr.fns.initContact();
  bnmr.fns.initMobile();
};

document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    bnmr.fns.initFns();
  }
};
