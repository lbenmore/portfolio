var LazyLoader = function (options) {
  var
  obsThresholds = [],
  obs,
  obsOptions,
  obsHandler;

  if (!'IntersectionObserver' in window) 'LazyLoader: IntersectionObserver not supported.';
  if (!options.target) throw "LazyLoader: Please provide an HTML Node `target` in the configuration object parameter.";
  if (!options.items) throw "LazyLoader: Please provide an array of `items` in the configuration object parameter.";

  this.target = options.target;
  this.items = options.items;

  this.container = document.createElement('div');

  this.target.classList.add('lazyloader');
  this.container.classList.add('lazyloader__container');

  this.target.style.overflow = 'hidden';
  if (getComputedStyle(this.target).transform == 'none') this.target.style.transform = 'translateZ(0)';

  this.target.appendChild(this.container);

  for (var threshold = 0; threshold < 1; threshold += 0.01) {
    obsThresholds.push(threshold); // for pretty color fade
  }
  // obsThresholds = [0.5]; // all that's needed for image load

  obsHandler = function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        entry.target.style.backgroundImage = 'url("' + entry.target.dataset.imageUrl + '")';
      } else {
        // entry.target.style.backgroundColor = 'hsl(0, 0%, ' + entry.intersectionRatio * 150 + '%)'; // fade up from black
        entry.target.style.backgroundColor = 'hsl(272, 100%, ' + entry.intersectionRatio * 100 + '%)'; // PURPLLLLLLLLE
      }
    }
  };

  obsOptions = {
    root: this.container,
    threshold: obsThresholds
  };

  obs = new IntersectionObserver(obsHandler, obsOptions);

  this.populate = function () {
    for (var i = 0; i < this.items.length; i++) {
      var
      item = this.items[i],
      el = document.createElement('div');

      el.classList.add('lazyloader__item');

      el.dataset.imageUrl = item;

      this.container.appendChild(el);

      obs.observe(el);
    }
  };

  this.populate.call(this);
};
