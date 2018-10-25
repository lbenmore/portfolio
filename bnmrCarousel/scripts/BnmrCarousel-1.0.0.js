class BnmrCarousel {
	constructor (options) {
		this.location = document.querySelector(options.location) || document.querySelector('body');
		this.width = parseInt(options.width) || 0;
		this.height = parseInt(options.height) || 0;
		this.transition = options.transition || 'slide';
		this.animDuration = options.animDuration || 1000;
		this.animDelay = options.animDelay || 3000;
		this.animTimingFunction = options.animTimingFunction || 'ease';
		this.arrows = options.arrows || true;
		this.pagination = options.pagination || true;
		this.images = options.images || ['',''];
		this.autorotate = options.autorotate || true;
		this.iterations = options.iterations || 0;
		this.currImg = 0;

		this.init();
	}

	$ (selector) {
		let el;
		selector.slice(0, 1) == '#' ? el = document.querySelector(selector) : el = document.querySelectorAll(selector);
		(typeof el == 'object' && el.length == 1) ? el = el[0] : null;
		return el;
	}

	stop () {
		clearInterval(this.autorotateInterval);
	}

	updatePagination () {
		for (let bubble of this.$('.carousel__indicator')) {
			bubble.classList.remove('carousel__indicator--active');
		}

		this.$('.carousel__indicator')[this.currImg].classList.add('carousel__indicator--active');
	}

	slide (e, dir) {
		if (e.type == 'click') {
			this.stop();
		}

		if (!dir || dir == null || dir == undefined) {
			dir = e.target.getAttribute('data-direction');
		}

		this.$('.carousel__outView').style.transition = '';
		this.$('.carousel__inView').style.transition = '';

		switch (dir) {
			case 'right':
				this.$('.carousel__outView').style.transform = 'translateX(100%)';
				this.$('.carousel__inView').style.transform = 'translateX(0)';

				if (this.currImg < this.images.length - 1) {
					this.currImg++;
				} else {
					this.currImg = 0;
				}
			break;

			case 'left':
				this.$('.carousel__outView').style.transform = 'translateX(-100%)';
				this.$('.carousel__inView').style.transform = 'translateX(0)';

				if (this.currImg > 0) {
					this.currImg--;
				} else {
					this.currImg = this.images.length - 1;
				}
			break;
		}

		this.$('.carousel__outView').style.backgroundImage = `url("${this.images[this.currImg]}")`;

		setTimeout(() => {
			this.$('.carousel__outView').style.transition = `transform ${this.animDuration}ms ${this.animTimingFunction}`;
			this.$('.carousel__inView').style.transition = `transform ${this.animDuration}ms ${this.animTimingFunction}`;
		}, 50);

		setTimeout(() => {
			switch (dir) {
				case 'right':
					this.$('.carousel__outView').style.transform = 'translateX(0)';
					this.$('.carousel__inView').style.transform = 'translateX(-100%)';
				break;

				case 'left':
					this.$('.carousel__outView').style.transform = 'translateX(0)';
					this.$('.carousel__inView').style.transform = 'translateX(100%)';
				break;
			}

			let holder = this.$('.carousel__outView');

			this.$('.carousel__inView').classList.add('carousel__outView');
			this.$('.carousel__inView').classList.remove('carousel__inView');

			holder.classList.add('carousel__inView');
			holder.classList.remove('carousel__outView');
		}, 100);

		if (this.pagination) {
			this.updatePagination();
		}
	}

	initArrows () {
		this.arrowLeft = document.createElement('div'),
		this.arrowRight = document.createElement('div');

		this.arrowLeft.style.position = 'absolute';
		this.arrowLeft.style.left = '0';
		this.arrowLeft.style.height = '100%';
		this.arrowLeft.style.minWidth = '80px';
		this.arrowLeft.style.maxWidth = '200px';
		this.arrowLeft.style.width = '10%';
		this.arrowLeft.classList.add('carousel__arrow');
		this.arrowLeft.classList.add('carousel__arrow--left');
		this.arrowLeft.setAttribute('data-direction', 'left');

		this.arrowRight.style.position = 'absolute';
		this.arrowRight.style.right = '0';
		this.arrowRight.style.height = '100%';
		this.arrowRight.style.minWidth = '80px';
		this.arrowRight.style.maxWidth = '200px';
		this.arrowRight.style.width = '10%';
		this.arrowRight.classList.add('carousel__arrow');
		this.arrowRight.classList.add('carousel__arrow--right');
		this.arrowRight.setAttribute('data-direction', 'right');

		this.arrowLeft.addEventListener('click', this[this.transition].bind(this));
		this.arrowRight.addEventListener('click', this[this.transition].bind(this));

		this.container.appendChild(this.arrowLeft);
		this.container.appendChild(this.arrowRight);
	}

	initPagination () {
		this.bubbles = document.createElement('div');
		this.bubbles.style.position = 'absolute';
		this.bubbles.style.right = '0';
		this.bubbles.style.bottom = '5px';
		this.bubbles.style.left = '0';
		this.bubbles.style.height = '20px';
		this.bubbles.style.textAlign = 'center';
		this.bubbles.classList.add('carousel__pagination');

		let bubbleCounter = 0;
		for (let img of this.images) {
			let bubble = document.createElement('div');
			bubble.style.position = 'relative';
			bubble.style.width = '10px';
			bubble.style.height = '10px';
			bubble.style.display = 'inline-block';
			bubble.style.marginRight = '4px';
			bubble.style.boxSizing = 'border-box';
			bubble.style.border = '2px solid #fff';
			bubble.style.borderRadius = '50%';
			bubble.classList.add('carousel__indicator');
			bubble.setAttribute('data-image', bubbleCounter);

			bubbleCounter++;

			bubble.addEventListener('click', (e) => {
				let thisImg = Number(e.target.getAttribute('data-image')),
						thisDir;

				if (thisImg > this.currImg) {
					thisDir = 'right';
					this.currImg = thisImg - 1;
				} else {
					thisDir = 'left';
					this.currImg = thisImg + 1;
				}

				this[this.transition](e, thisDir);
			});

			this.bubbles.appendChild(bubble);
		}

		this.container.appendChild(this.bubbles);

		this.$('.carousel__indicator')[this.currImg].classList.add('carousel__indicator--active');
	}

	initAutorotate () {
		switch (this.transition) {
			case 'slide':
				this.$('.carousel__outView').style.transform = 'translateX(100%)';
			break;
		}

		this.autorotateInterval = setInterval(() => {
			this[this.transition]({type:'auto'}, 'right');
		}, this.animDuration + this.animDelay);
	}

	init () {
		for (let img of this.images) {
			new Image().src = img;
		}

		this.container = document.createElement('div'),
		this.inView = document.createElement('div'),
		this.outView = document.createElement('div');

		this.container.style.position = 'relative';
		this.container.style.width = this.width + 'px';
		this.container.style.height = this.height + 'px';
		this.container.style.overflow = 'hidden';
		this.container.classList.add('carousel__container');

		this.inView.style.position = 'absolute';
		this.inView.style.width = '100%';
		this.inView.style.height = '100%';
		this.inView.style.backgroundImage = `url("${this.images[0]}")`;
		this.inView.style.backgroundPosition = 'center';
		this.inView.style.backgroundRepeat = 'no-repeat';
		this.inView.style.backgroundSize = 'cover';
		this.inView.classList.add('carousel__inView');
		this.container.appendChild(this.inView);

		this.outView.style.position = 'absolute';
		this.outView.style.width = '100%';
		this.outView.style.height = '100%';
		this.outView.style.backgroundImage = `url("${this.images[1]}")`;
		this.outView.style.backgroundPosition = 'center';
		this.outView.style.backgroundRepeat = 'no-repeat';
		this.outView.style.backgroundSize = 'cover';
		this.outView.classList.add('carousel__outView');
		this.container.appendChild(this.outView);

		this.location.appendChild(this.container);

		this.arrows ? this.initArrows() : null;
		this.pagination ? this.initPagination() : null;

		if (this.autorotate) {
			this.initAutorotate();
			if (this.iterations) {
				this.autorotateDuration = this.images.length * (this.animDuration + this.animDelay) * this.iterations;
				setTimeout(() => {
					this.stop();
				}, this.autorotateDuration);
			}
		}
	}
}
