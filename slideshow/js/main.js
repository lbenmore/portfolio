(function (win, doc) {
  const init = () => {
    new Slideshow({
      target: document.querySelector('.container'),
      directory: '../images',
      api: './php/slideshow.php',
      speed: 1000,
      toggle: true,
      settings: true,
      removeImages: false
    });
  };

  if (doc.readyState === 'complete') {
    init();
  } else {
    doc.addEventListener('DOMContentLoaded', init);
  }
})(window, window.document);