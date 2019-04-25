const
setDarkMode = () => {
  document.body.dataset.darkmode = document.body.dataset.darkmode == 'true' ? 'false' : 'true';
};

addEventListener('LOAD_EVENT', () => {
  if (document.querySelector('.menu__darkmode input')) {
    $$('.menu__darkmode input').on('change', setDarkMode);
  }
});
