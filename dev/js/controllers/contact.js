core.controllers.Contact = () => {
  const
  onSubmitForm = (e) => {
    const
    email = $$('form input[type="email"]').value,
    subject = $$('form input[type="text"]').value,
    body = $$('form textarea').value;

    if (
      !$$('form input[type="email"]').checkValidity() ||
      !$$('form input[type="text"]').checkValidity() ||
      !$$('form textarea').checkValidity()
    ) {
      alert('Please fill out all fields correctly before submitting email message.');
      return;
    }

    $$('form button').innerHTML = '<i class="fa fa-cog fa-spin"></i>';

    $$.ajax({
      type: 'json',
      method: 'POST',
      url: './php/index.php',
      params: {
        action: 'send_email',
        from: email,
        subject: subject,
        body: body
      },
      callback: (response) => {
        $$.log(response, 'dir');
        $$('form button').innerHTML = 'Send';
        $$('form input[type="email"]').value = "";
        $$('form input[type="text"]').value = "";
        $$('form textarea').value = "";
      }
    });
  },

  onInputFocusChange = (e) => {
    switch (e.type) {
      case 'focus':
        e.target.parentNode.classList.add('active');
      break;

      case 'blur':
        if (!e.target.value) e.target.parentNode.classList.remove('active');
      break;
    }
  },

  eventListeners = () => {
    $$('form input, form textarea').on('focus', onInputFocusChange);
    $$('form input, form textarea').on('blur', onInputFocusChange);
    $$('form button').on('tap', onSubmitForm);
    $$('form').onsubmit = onSubmitForm;
  },

  initContactFns = () => {
    eventListeners();
  };

  if ($$.loaded) {
    initContactFns();
  } else {
    addEventListener('LOAD_EVENT', initContactFns);
  }
};
