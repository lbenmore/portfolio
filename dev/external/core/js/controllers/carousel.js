core.controllers.Carousel = function () {
  var max = 99;

  function initCarousel () {
    new Carousel({
      target: $$('.bnmr-carousel'),
      images: [
        'https://picsum.photos/600/400/?image=1079',
        'https://picsum.photos/600/400/?image=1078',
        'https://picsum.photos/600/400/?image=1077',
        'https://picsum.photos/600/400/?image=1076',
        'https://picsum.photos/600/400/?image=1075',
      ],
      arrows: true,
      pagination: true
    });
  }

  function load () {
    if ('Carousel' in window) {
      initCarousel();
    } else {
      $$.log('carousel load attempt: ' + (99 - --max));
      if (max) setTimeout(load, 100);
    }
  }

  load();
};
