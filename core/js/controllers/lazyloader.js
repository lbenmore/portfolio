core.controllers.LazyLoader = function () {
  var max = 99;

  var initFns = function () {
    var loadymagig = new LazyLoader({
      target: $$('.gallery'),
      items: [
        'https://unsplash.it/600/600/?image=1079',
        'https://unsplash.it/600/600/?image=1078',
        'https://unsplash.it/600/600/?image=1077',
        'https://unsplash.it/600/600/?image=1076',
        'https://unsplash.it/600/600/?image=1075',
        'https://unsplash.it/600/600/?image=1074',
        'https://unsplash.it/600/600/?image=1073',
        'https://unsplash.it/600/600/?image=1072',
        'https://unsplash.it/600/600/?image=1071',
        'https://unsplash.it/600/600/?image=1070',
        'https://unsplash.it/600/600/?image=1069',
        'https://unsplash.it/600/600/?image=1068',
        'https://unsplash.it/600/600/?image=1067',
        'https://unsplash.it/600/600/?image=1066',
        'https://unsplash.it/600/600/?image=1065',
        'https://unsplash.it/600/600/?image=1064',
        'https://unsplash.it/600/600/?image=1063',
        'https://unsplash.it/600/600/?image=1062',
        'https://unsplash.it/600/600/?image=1061',
        'https://unsplash.it/600/600/?image=1060',
        'https://unsplash.it/600/600/?image=1059',
        'https://unsplash.it/600/600/?image=1058',
        'https://unsplash.it/600/600/?image=1057',
        'https://unsplash.it/600/600/?image=1056',
        'https://unsplash.it/600/600/?image=1055',
        'https://unsplash.it/600/600/?image=1054',
        'https://unsplash.it/600/600/?image=1053',
        'https://unsplash.it/600/600/?image=1052',
        'https://unsplash.it/600/600/?image=1051',
        'https://unsplash.it/600/600/?image=1050',
      ]
    });
  };

  var initLoad = function () {
    if ('LazyLoader' in window) {
      initFns();
    } else {
      if (max) {
        console.log('lazyloader init attempt: ' + (99 - --max));
        setTimeout(initLoad, 100);
      }
    }
  }

  initLoad();
};
