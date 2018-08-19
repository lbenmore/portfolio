var Carousel = function (options) {
  var _this = this;

  if (!options || typeof options != 'object') {
    console.error('No configuration for carousel provided.');
    return;
  }

  _this.target = options.target;
  _this.images = options.images;
  _this.arrows = options.arrows || true;
  _this.pagination = options.pagination || true;
  _this.active = 0;
  _this.animating = false;

  _this.slide = function (e) {
    if (!_this.animating) {
      _this.animating = true;

      $$('.carousel__item').css('-webkit-transition', 'none');
      $$('.carousel__item').css('transition', 'none');

      switch (e.target) {
        case $$('.carousel__arrow--left'):
          _this.active = _this.active < _this.images.length - 1 ? _this.active + 1 : 0;
        break;

        case $$('.carousel__arrow--right'):
          _this.active = _this.active > 0 ? _this.active - 1 : _this.images.length - 1;
        break;
      }

      $$('.carousel__item--outView').css('background-image', 'url("' + _this.images[_this.active] + '")');

      setTimeout(function () {
        switch (e.target) {
          case $$('.carousel__arrow--left'):
            $$('.carousel__item--outView').css('-webkit-transform', 'translateX(-100%)');
            $$('.carousel__item--outView').css('transform', 'translateX(-100%)');
          break;

          case $$('.carousel__arrow--right'):
            $$('.carousel__item--outView').css('-webkit-transform', 'translateX(100%)');
            $$('.carousel__item--outView').css('transform', 'translateX(100%)');
          break;
        }
      }, 50);

      setTimeout(function () {
        switch (e.target) {
          case $$('.carousel__arrow--left'):
            $$('.carousel__item--inView').animate({
              '-webkit-transform': 'translateX(100%)',
              transform: 'translateX(100%)'
            })
          break;

          case $$('.carousel__arrow--right'):
            $$('.carousel__item--inView').animate({
              '-webkit-transform': 'translateX(-100%)',
              transform: 'translateX(-100%)'
            })
          break;
        }

        $$('.carousel__item--outView').animate({
          '-webkit-transform': 'translateX(0)',
          transform: 'translateX(0)'
        })
      }, 100);

      setTimeout(function () {
        var
        inView = $$('.carousel__item--inView'),
        outView = $$('.carousel__item--outView');

        inView.classList.remove('carousel__item--inView');
        inView.classList.add('carousel__item--outView');

        outView.classList.remove('carousel__item--outView');
        outView.classList.add('carousel__item--inView');

        _this.animating = false;
      }, 150);
    }
  };

  _this.init = function () {
    var
    inView = document.createElement('div'),
    outView = document.createElement('div'),
    arrowLeft,
    arrowRight,
    bubbles;

    inView.classList.add('carousel__item');
    inView.classList.add('carousel__item--inView');
    outView.classList.add('carousel__item');
    outView.classList.add('carousel__item--outView');

    inView.style.backgroundImage = 'url("' + _this.images[_this.active] + '")';

    _this.target.appendChild(inView);
    _this.target.appendChild(outView);

    if (_this.arrows) {
      arrowLeft = document.createElement('div');
      arrowRight = document.createElement('div');

      arrowLeft.classList.add('carousel__arrow');
      arrowLeft.classList.add('carousel__arrow--left');
      arrowRight.classList.add('carousel__arrow');
      arrowRight.classList.add('carousel__arrow--right');

      arrowLeft.innerHTML = '<i class="fa fa-chevron-left"></i>';
      arrowRight.innerHTML = '<i class="fa fa-chevron-right"></i>';

      _this.target.appendChild(arrowLeft);
      _this.target.appendChild(arrowRight);

      arrowLeft.onclick = arrowRight.onclick = _this.slide;
    }

    if (_this.pagination) {
      bubbles = document.createElement('div');

      bubbles.classList.add('carousel__pagination');

      for (var i = 0; i < _this.images.length; i++) {
        var bubble = document.createElement('span');

        bubble.classList.add('carousel__indicator');
        i == 0 ? bubble.classList.add('active') : null;

        bubbles.appendChild(bubble);
      }

      _this.target.appendChild(bubbles);
    }

    _this.target.style.overflow = 'hidden';
  };

  _this.init();
};
