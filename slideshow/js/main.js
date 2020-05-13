(function (win, doc) {
  const init = () => {
    new Slideshow({
      toggle: true,
      settings: true,
      target: document.querySelector('.container'),
      directory: '../images',
      api: './php/slideshow.php',
      removeImages: false
    });
  };

  if (doc.readyState === 'complete') {
    init();
  } else {
    doc.addEventListener('DOMContentLoaded', init);
  }
})(window, window.document);