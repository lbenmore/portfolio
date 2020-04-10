core.controllers.Carousel = () => {
	class Carousel {
		constructor (options) {
			this.target = options.target;
			this.images = options.images;

			this.active = 0;
			this.container = document.createElement('div');
			this.animating = false;

			this.populate();
		}

		slide (direction) {
			const
			delay = 50,
			inView = this.container.querySelector('.carousel__panel--inView'),
			outView = this.container.querySelector('.carousel__panel--outView');

			outView.classList.add('static');

			setTimeout(() => {
				Object.assign(outView.style, {
					transform: `translateX(${100 * direction}%)`
				});

				setTimeout(() => {
					outView.classList.remove('static');

					setTimeout(() => {
						Object.assign(inView.style, {
							transform: `translateX(${100 * direction * -1}%)`
						});

						Object.assign(outView.style, {
							transform: 'translateX(0)'
						});

						setTimeout(() => {
							inView.classList.remove('carousel__panel--inView');
							outView.classList.remove('carousel__panel--outView');
							inView.classList.add('carousel__panel--outView');
							outView.classList.add('carousel__panel--inView');
							this.animating = false;
						}, 500);
					}, delay);
				}, delay);
			}, delay);
		}

		to (direction) {
			if (!this.animating) {
				const outView = this.container.querySelector('.carousel__panel--outView');

				let dir;

				this.animating = true;

				if (event) {
					dir = event.target.className.toLowerCase().includes('left') ? -1 : 1;
				} else {
					dir = direction == 'previous' ? -1 : 1;
				}

				if (dir > 0) {
					if (this.active < this.images.length - 1) {
						++this.active;
					} else {
						this.active = 0;
					}
				} else {
					if (this.active > 0) {
						--this.active;
					} else {
						this.active = this.images.length - 1;
					}
				}

				Object.assign(outView.style, {
					backgroundImage: `url(${this.images[this.active]})`
				});

				this.slide(dir);
			}
		}

		populate () {
			const elements = {};

			elements.panels = {};
			elements.arrows = {};

			elements.panels.inView = document.createElement('div');
			elements.panels.outView = document.createElement('div');
			elements.arrows.left = document.createElement('div');
			elements.arrows.right = document.createElement('div');

			this.target.appendChild(this.container);
			for (const prop in elements) {
				if (typeof elements[prop] == 'object') {
					for (const el in elements[prop]) {
						this.container.appendChild(elements[prop][el]);
					}
				}
			}

			this.target.classList.add('carousel');
			this.container.classList.add('carousel__container');
			elements.panels.inView.classList.add('carousel__panel');
			elements.panels.inView.classList.add('carousel__panel--inView');
			elements.panels.outView.classList.add('carousel__panel');
			elements.panels.outView.classList.add('carousel__panel--outView');
			elements.arrows.left.classList.add('carousel__arrow');
			elements.arrows.left.classList.add('carousel__arrow--left');
			elements.arrows.right.classList.add('carousel__arrow');
			elements.arrows.right.classList.add('carousel__arrow--right');

			elements.arrows.left.innerHTML = '&laquo;';
			elements.arrows.right.innerHTML = '&raquo;';

			Object.assign(elements.panels.inView.style, {
				backgroundImage: `url(${this.images[this.active]})`
			});

			Object.assign(elements.panels.outView.style, {
				transform: 'translateX(100%)'
			});

			for (const arrow in elements.arrows) {
				elements.arrows[arrow].addEventListener('click', this.to.bind(this));
			}
		}
	}

	const initFns = () => {
		const carousel = new Carousel({
			target: document.querySelector('.one-item-carousel'),
			images: [
				'https://unsplash.it/800/600/?image=1079',
				'https://unsplash.it/800/600/?image=1078',
				'https://unsplash.it/800/600/?image=1077',
				'https://unsplash.it/800/600/?image=1076',
				'https://unsplash.it/800/600/?image=1075'
			]
		});
	};

	if (core.isLoaded()) {
		initFns();
	} else {
		core.events.addEventListener('load', initFns, {once: true});
	}
};
