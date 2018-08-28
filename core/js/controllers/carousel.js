var
initCarousel = function () {
  if ('Carousel' in window) {
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
  } else {
    setTimeout(initCarousel, 100);
  }
},

initFns = function () {
  initCarousel();
};

initFns();
