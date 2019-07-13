core.controllers.Tripousel = () => {
	var Tripousel = function (options) {
		// because `this` is a bitch
		var _this = this;


		// Initialize public variables
		_this.target = options.target || document.body;
		_this.items = options.items || [];
		_this.animDuration = options.duration || 500;
		_this.container = document.createElement('div');
		_this.center = 0;
		_this.left = _this.items.length - 1;
		_this.right = 1;


		// Animate carousel movement
		_this.slide = function (dir) {
			var
			inViewRight = _this.container.querySelector('.carousel__panel--inView.carousel__panel--right'),
			inViewCenter = _this.container.querySelector('.carousel__panel--inView.carousel__panel--center'),
			inViewLeft = _this.container.querySelector('.carousel__panel--inView.carousel__panel--left'),
			outView = _this.container.querySelector('.carousel__panel--outView'),
			dur = _this.duration,
			del = 50;

			// Remove transition of invisible element
			outView.classList.add('static');

			// Set positioning of invisible element
			setTimeout(function () {
				outView.classList.remove('carousel__panel--left');
				outView.classList.remove('carousel__panel--right');
				dir == 1
					? outView.classList.add('carousel__panel--right')
					: outView.classList.add('carousel__panel--left');

				// Allow transition of invisible element
				setTimeout(function () {
					outView.classList.remove('static');

					// Set new classnames of all elements
					setTimeout(function () {
						switch (dir == 1) {
							case true:
								inViewRight.classList.remove('carousel__panel--right');
								inViewRight.classList.add('carousel__panel--center');

								inViewCenter.classList.remove('carousel__panel--center');
								inViewCenter.classList.add('carousel__panel--left');

								inViewLeft.classList.remove('carousel__panel--inView');
								inViewLeft.classList.add('carousel__panel--outView');

								outView.classList.remove('carousel__panel--outView');
								outView.classList.add('carousel__panel--inView');
							break;

							case false:
								inViewRight.classList.remove('carousel__panel--inView');
								inViewRight.classList.add('carousel__panel--outView');

								inViewCenter.classList.remove('carousel__panel--center');
								inViewCenter.classList.add('carousel__panel--right');

								inViewLeft.classList.remove('carousel__panel--left');
								inViewLeft.classList.add('carousel__panel--center');

								outView.classList.remove('carousel__panel--outView');
								outView.classList.add('carousel__panel--inView');
							break;
						}
					}, del)
				}, del);
			}, del);
		};


		// Update carousel content
		_this.updateContent = function (e) {
			var outView = _this.container.querySelector('.carousel__panel--outView');

			// Set direction to 1 if clicking right or -1 if clicking left
			if (!e) { // <- for when we need this to auto-advance through items
				dir = 1;
			} else {
				dir = (e.target.className.indexOf('right') > -1) ? 1 : -1;
			}

			// Set the new indeces of each visible slide after animation
			switch (dir == 1) {
				case true:
					_this.left = _this.left < _this.items.length - 1 ? _this.left + 1 : 0;
					_this.center = _this.center < _this.items.length - 1 ? _this.center + 1 : 0;
					_this.right = _this.right < _this.items.length - 1 ? _this.right + 1 : 0;

					outView.style.backgroundImage = 'url("' + _this.items[_this.right].image + '")'
					outView.innerHTML = _this.items[_this.right].copy;
				break;

				case false:
					_this.left = _this.left > 0 ? _this.left - 1 : _this.items.length - 1;
					_this.center = _this.center > 0 ? _this.center - 1 : _this.items.length - 1;
					_this.right = _this.right > 0 ? _this.right - 1 : _this.items.length - 1;

					outView.style.backgroundImage = 'url("' + _this.items[_this.left].image + '")'
					outView.innerHTML = _this.items[_this.left].copy;
				break;
			}

			// Send to animator with parameter of whether this is going left (-1) or right (1)
			_this.slide(dir);
		};


		// Attach event listeners
		_this.eventListeners = function (els) {
			els.arrows.forEach(function (arrow) {
				arrow.addEventListener('click', _this.updateContent);
			})
		};


		// Create all carousel elements
		_this.populate = function () {
			var elements = {};
			elements.panels = {};
			elements.arrows = {};

			// Create elements
			elements.panels.inViewLeft = document.createElement('div');
			elements.panels.inViewRight = document.createElement('div');
			elements.panels.inViewCenter = document.createElement('div');
			elements.panels.outView = document.createElement('div');

			elements.arrows.left = document.createElement('div');
			elements.arrows.right = document.createElement('div');


			// Assign classes
			_this.container.classList.add('carousel');

			elements.panels.inViewLeft.classList.add('carousel__panel');
			elements.panels.inViewLeft.classList.add('carousel__panel--inView');
			elements.panels.inViewLeft.classList.add('carousel__panel--left');

			elements.panels.inViewRight.classList.add('carousel__panel');
			elements.panels.inViewRight.classList.add('carousel__panel--inView');
			elements.panels.inViewRight.classList.add('carousel__panel--right');

			elements.panels.inViewCenter.classList.add('carousel__panel');
			elements.panels.inViewCenter.classList.add('carousel__panel--inView');
			elements.panels.inViewCenter.classList.add('carousel__panel--center');

			elements.panels.outView.classList.add('carousel__panel');
			elements.panels.outView.classList.add('carousel__panel--outView');
			elements.panels.outView.classList.add('carousel__panel--right');

			elements.arrows.left.classList.add('carousel__arrow');
			elements.arrows.left.classList.add('carousel__arrow--left');

			elements.arrows.right.classList.add('carousel__arrow');
			elements.arrows.right.classList.add('carousel__arrow--right');


			// Assign inline styles and content
			Object.assign(elements.panels.inViewLeft.style, {
				backgroundImage: 'url("' + _this.items[_this.left].image + '")'
			});
			elements.panels.inViewLeft.innerHTML = _this.items[_this.left].copy;

			Object.assign(elements.panels.inViewCenter.style, {
				backgroundImage: 'url("' + _this.items[_this.center].image + '")'
			});
			elements.panels.inViewCenter.innerHTML = _this.items[_this.center].copy;

			Object.assign(elements.panels.inViewRight.style, {
				backgroundImage: 'url("' + _this.items[_this.right].image + '")'
			});
			elements.panels.inViewRight.innerHTML = _this.items[_this.right].copy;

			elements.arrows.left.innerHTML = '&laquo;';
			elements.arrows.right.innerHTML = '&raquo;';


			// Write elements to the DOM
			for (var type in elements) {
				for (var el in elements[type]) {
					_this.container.appendChild(elements[type][el]);
				}
			}

			_this.target.appendChild(_this.container);


			// Send necessary elements to eventListeners
			_this.eventListeners({
				arrows: [
					elements.arrows.left,
					elements.arrows.right
				]
			})
		};


		// Aliasing
		_this.animate = _this.updateContent;


		// Initialize
		_this.populate();
	};

	var slides = [
		{
			copy: 'Slide 1',
			image: 'https://unsplash.it/800/600/?image=109'
		},
		{
			copy: 'Slide 2',
			image: 'https://unsplash.it/800/600/?image=1079'
		},
		{
			copy: 'Slide 3',
			image: 'https://unsplash.it/800/600/?image=907'
		},
		{
			copy: 'Slide 4',
			image: 'https://unsplash.it/800/600/?image=654'
		},
		{
			copy: 'Slide 5',
			image: 'https://unsplash.it/800/600/?image=977'
		}
	];

	const initFns = () => {
		var trip = new Tripousel({
			target: document.querySelector('.three-item-carousel'),
			items: slides
		});
	
		var rotateNTimes = 5;
		var rotate = setInterval(function () {
			if (rotateNTimes) {
				trip.animate();
				--rotateNTimes;
			} else {
				clearInterval(rotate);
			}
		}, 2000);
	};

	if (core.isLoaded()) {
		initFns();
	} else {
		core.events.addEventListener('load', initFns, {once: true});
	}
};
