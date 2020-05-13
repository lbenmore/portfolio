core.controllers.Slideshow = () => {
	class SettingsLightbox {
		async resetSlideshowImages(checkAgainst, tries) {
			const imgsReq = await this.slideshow.getImages(this.slideshow.currentDirectory);
			this.slideshow.images = imgsReq.images;
			if (checkAgainst && this.slideshow.images.length < checkAgainst) {
				return setTimeout(this.resetSlideshowImages.bind(this), 100, checkAgainst);
			}
			this.slideshow.startSlideshow();
		}

		async onImageInput() {
			if (event.target.files) {
				const files = Object.keys(event.target.files).map(x => event.target.files[x]);
				const newDirReq = await this.slideshow.createDirectory(this.slideshow.directory);

				if (newDirReq.status) {
					this.slideshow.currentDirectory = newDirReq.directory;
					this.slideshow.directories = await this.slideshow.getDirectories();

					files.forEach(file => {
						this.slideshow.uploadImage(file);
					});

					this.resetSlideshowImages.call(this, files.length);

					this.close();
				}
			}
		}

		onSpeedInput() {
			const input = event.target;
			const span = input.parentNode.querySelector('span');
			const value = input.value;

			span.innerHTML = value;
		}

		onUpdate() {
			event.preventDefault();

			const form = event.target.parentNode.parentNode;
			const speed = form.querySelector('input[name="speed"]').value * 1000;
			let animationTypes = form.querySelectorAll('input[name="anim_types"]');
			let directories = form.querySelectorAll('input[name="image_dirs"]');
			let selectedDir

			directories = Object.keys(directories).map(x => directories[x]);
			animationTypes = Object.keys(animationTypes).map(x => animationTypes[x]);

			selectedDir = directories.filter(dir => dir.checked)[0].value;

			this.slideshow.animations = animationTypes.filter(type => type.checked).map(x => x.value);

			if (this.slideshow.currentDirectory !== selectedDir) {
				this.slideshow.currentDirectory = selectedDir;
				this.resetSlideshowImages();
			}

			if (this.speed !== speed) {
				this.slideshow.pause();
				this.slideshow.speed = speed;
				this.slideshow.play();
			}

			this.close();
		}

		onCancel() {
			event.preventDefault();
			this.close();
		}

		close() {
			this.lightbox.style.display = 'none';
		}

		open() {
			this.lightbox.style.display = 'table';
		}

		lightboxHtml() {
			return `<div class="overlay">
				<div class="lightboxWrapper">
					<div class="lightbox">
						<form>
							<fieldset>
								<legend>Images</legend>
								${this.slideshow.directories.map((dir, i) => {
									return `
										<input
											id="dir-${i}"
											type="radio" 
											name="image_dirs" 
											value="${dir}" 
											${this.slideshow.currentDirectory === dir ? 'checked' : ''}
										>
										<label for="dir-${i}" style="text-transform:capitalize">
											${dir.replace(`${this.slideshow.directory}/`, '').replace(/_/g, ' ')}
										</label>`
								}).join('<br>') }<br>
								<label><input type="file" hidden multiple name="new_image_dir"><span>+</span> Upload Your Images</label>
							</fieldset>
							<fieldset>
								<legend>Animation Types</legend>

								<input type="checkbox" name="anim_types" id="anim-fadeIn" value="fadeIn" ${this.slideshow.animations.includes('fadeIn') ? 'checked' : ''}>
								<label for="anim-fadeIn">Fade In</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-slideUp" value="slideUp" ${this.slideshow.animations.includes('slideUp') ? 'checked' : ''}>
								<label for="anim-slideUp">Slide Up</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-slideDown" value="slideDown" ${this.slideshow.animations.includes('slideDown') ? 'checked' : ''}>
								<label for="anim-slideDown">Slide Down</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-slideRight" value="slideRight" ${this.slideshow.animations.includes('slideRight') ? 'checked' : ''}>
								<label for="anim-slideRight">Slide Right</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-slideLeft" value="slideLeft" ${this.slideshow.animations.includes('slideLeft') ? 'checked' : ''}>
								<label for="anim-slideLeft">Slide Left</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-rotateRight" value="rotateRight" ${this.slideshow.animations.includes('rotateRight') ? 'checked' : ''}>
								<label for="anim-rotateRight">Rotate Right</label><br>
								
								<input type="checkbox" name="anim_types" id="anim-rotateLeft" value="rotateLeft" ${this.slideshow.animations.includes('rotateLeft') ? 'checked' : ''}>
								<label for="anim-rotateLeft">Rotate Left</label>
								
							</fieldset>
							<fieldset>
								<legend>Animation Speed</legend>
								<input type="range" name="speed" min="0.5" max="3" step="0.25" value="${this.slideshow.speed / 1000}"> <br><span>${this.slideshow.speed / 1000}</span> seconds
							</fieldset>
							<button class="btnUpdate"><span>Update</span></button>
							<button class="btnCancel"><span>Cancel</span></button>
						</form>
					</div>
				</div>
			</div>`;
		}

		constructor(slideshow) {
			this.slideshow = slideshow;

			const dummy = document.createElement('div');
			const html = this.lightboxHtml();

			dummy.innerHTML = html;
			Object.assign(dummy.style, {
				width: '100%',
				height: '100%',
				overflow: 'auto'
			});

			this.slideshow.target.appendChild(dummy);
			this.lightbox = dummy.children[0];

			this.lightbox.querySelector('input[name="new_image_dir"]').addEventListener('input', this.onImageInput.bind(this));
			this.lightbox.querySelector('input[name="speed"]').addEventListener('input', this.onSpeedInput.bind(this));
			this.lightbox.querySelector('.btnCancel').addEventListener('click', this.onCancel.bind(this));
			this.lightbox.querySelector('.btnUpdate').addEventListener('click', this.onUpdate.bind(this));
		}
	}

	class ContextMenu {
		getOffset(el, prop, value, endEl) {
			if (el === endEl) return value;
			else if (el.parentNode) return this.getOffset(el.parentNode, prop, value + el[prop], endEl);
			else return value;
		}

		updatePosition(evt) {
			const x = this.getOffset(event.target, 'offsetLeft', evt.offsetX, this.slideshow.target);
			const y = this.getOffset(event.target, 'offsetTop', evt.offsetY, this.slideshow.target);

			Object.assign(this.menu.style, {
				top: `${y}px`,
				left: `${x}px`
			});
		}

		close() {
			this.menu.style.display = 'none';
		}

		open(evt) {
			evt.preventDefault();
			this.updatePosition(evt);
			this.menu.style.display = 'block';
		}

		handleMenu() {
			if (this.active) this.close();
			else this.open(event);
		}

		createElement() {
			const menu = document.createElement('div');

			menu.classList.add('contextMenu');

			this.items.forEach(item => {
				const menuItem = document.createElement('div');
				menuItem.innerHTML = item.label;
				menuItem.onclick = item.onclick;
				menu.appendChild(menuItem);
			});

			this.slideshow.target.appendChild(menu);

			return menu;
		}

		constructor(slideshow, items) {
			this.slideshow = slideshow;
			this.items = items;
			this.active = false;

			this.menu = this.createElement();

			this.slideshow.target.addEventListener('contextmenu', this.handleMenu.bind(this));
			this.slideshow.target.addEventListener('click', this.close.bind(this));
		}
	}

	class Slideshow {
		debug (params) {
			const xhr = new XMLHttpRequest();
			const fd = new FormData();

			for (const key in params) fd.append(key, params[key]);

			xhr.onload = () => {
				let res;
				try {
					res = JSON.parse(xhr.responseText);
				} catch (e) {
					console.error(e);
					res = xhr.responseText;
				}
				console.log(res);
			}

			xhr.open('POST', this.api, true);
			xhr.send(fd);
		}

		randomize(arr) {
			if (typeof arr !== 'object' || !arr.length) return [];
			const deduped = arr.filter((x, i) => arr.indexOf(x) === i);
			const result = [];

			while (result.length < deduped.length) {
				let i = Math.floor(Math.random() * arr.length);
				if (result.indexOf(arr[i]) === -1) result.push(arr[i]);
			}

			return result;
		}

		pause() {
			clearInterval(this.interval);
			this.interval = null;
		}

		play() {
			this.pause();
			this.interval = setInterval(this.slideshowImageHandler.bind(this), this.speed * 1.5);
		}

		initSettings() {
			this.settingsLightbox = new SettingsLightbox(this);
			const menuOptions = [{
				label: 'Settings',
				onclick: this.settingsLightbox.open.bind(this.settingsLightbox)
			}];

			this.contextMenu = new ContextMenu(this, menuOptions);
		}

		generateToggle() {
			const toggle = document.createElement('label');
			const input = document.createElement('input');

			toggle.classList.add('toggle');
			toggle.classList.add('pause');
			toggle.setAttribute('for', 'togglePlay');

			input.setAttribute('type', 'checkbox');
			input.setAttribute('hidden', 'true');
			input.setAttribute('id', 'togglePlay');

			input.onchange = () => {
				toggle.classList.toggle('play');
				toggle.classList.toggle('pause');
				if (event.target.checked) this.pause();
				else this.play();
			}

			this.target.appendChild(input);
			this.target.appendChild(toggle);
		}

		removeImage(img) {
			img.classList.remove('anim');
			setTimeout(() => {
				img.parentNode.removeChild(img);
			}, this.speed);
		}

		spawnImage(path) {
			const img = document.createElement('img');
			const animClass = this.animations[Math.floor(Math.random() * this.animations.length)]
			img.src = `${this.currentDirectory.replace('../', '')}/${path}`;
			img.path = path;
			img.classList.add(animClass);

			img.onload = () => {
				const ratio = img.width / img.height;
				const width = this.target.offsetWidth / 4;
				const height = width / ratio;
				const minTop = height / 4 * -1;
				const maxTop = this.target.offsetHeight - (height / 4 * 3);
				const minLeft = width / 4 * -1;
				const maxLeft = this.target.offsetWidth - (width / 4 * 3);

				Object.assign(img.style, {
					position: 'absolute',
					top: `${Math.floor(Math.random() * (maxTop - minTop + 1) + minTop)}px`,
					left: `${Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft)}px`,
					width: `${width}px`,
					height: `${height}px`,
					transition: `opacity ${this.speed}ms, transform ${this.speed}ms`
				});

				this.target.appendChild(img);
				setTimeout(() => {
					img.classList.add('anim');
				}, 50)
			};

			return img;
		}

		slideshowImageHandler() {
			if (this.currentImages.length < this.randomized.length) {
				this.currentImages.push(this.spawnImage(this.randomized[this.currentImages.length]));
			} else {
				const shifted = this.currentImages.shift();
				this.currentImages.push(this.spawnImage(shifted.path));
				if (this.removeImages) this.removeImage(shifted);
			}
		}

		startSlideshow() {
			this.randomized = this.randomize(this.images);
			this.currentImages = [];
			this.play();
		}

		async getImages(directory) {
			try {
				const fd = new FormData();
				fd.append('action', 'get_images');
				fd.append('directory', directory || this.currentDirectory || '../images');

				return fetch(this.api, {
						method: 'POST',
						body: fd
					})
					.then(res => res.json())
					.catch(e => {
						console.error(e);
						return {
							status: 0,
							error: 'fetch error: ' + e.message,
						};
					});
			} catch (e) {
				console.error(e);
				return {
					status: 0,
					error: 'caught error: ' + e.message,
				};
			}
		}

		async uploadImage(file, dir) {
			const fd = new FormData();

			fd.append('action', 'upload_image');
			fd.append('directory', dir || this.currentDirectory)
			fd.append('file', file);

			return fetch(this.api, {
					method: 'POST',
					body: fd
				})
				.then(res => res.json())
				.catch(err => {
					console.error(err);
					return [];
				});
		}

		async createDirectory() {
			const fd = new FormData();

			fd.append('action', 'create_directory');
			fd.append('directory', this.directory);

			return fetch(this.api, {
					method: 'POST',
					body: fd
				})
				.then(res => res.json())
				.catch(err => {
					console.error(err);
					return [];
				});
		}

		async getDirectories() {
			const fd = new FormData();

			fd.append('action', 'get_directories');
			fd.append('directory', this.directory);

			return fetch(this.api, {
					method: 'POST',
					body: fd
				})
				.then(res => res.json())
				.catch(err => {
					console.error(err);
					return [];
				});
		}

		setStyles() {
			this.target.classList.add('slideshow');
		}

		isPlaying() {
			return !!this.interval;
		}

		async init(options) {
			let imagesReq = await this.getImages();
			this.images = imagesReq.images;

			const directoriesReq = await this.getDirectories();
			this.directories = directoriesReq.directories;

			if (!this.images.length) {
				this.currentDirectory = this.directories[0];
				imagesReq = await this.getImages(this.currentDirectory);
				this.images = imagesReq.images;
			}

			options.toggle && this.generateToggle();
			options.settings && this.initSettings();
			this.setStyles();
			this.startSlideshow();
		}

		constructor(options) {
			this.images = [];
			this.directories = [];
			this.interval = null;
			this.randomized = null;
			this.currentImages = [];
			this.directory = options.directory || './';
			this.currentDirectory = this.directory;
			this.target = options.target || document.body;
			this.speed = options.speed || 2000;
			this.api = options.api || './slideshow.php';
			this.removeImages = typeof options.removeImages === 'boolean' ? options.removeImages : true;
			this.animations = options.animations || [
				'fadeIn',
				'slideUp',
				'slideRight',
				'slideDown',
				'slideLeft',
				'rotateLeft',
				'rotateRight'
			];

			this.init(options || {});
		}
	}

	const ss = new Slideshow({
		target: document.querySelector('.dodo-box'),
		directory: '../..' + window.location.pathname + 'assets/img/slideshow',
		speed: 1000,
		toggle: true,
		settings: true,
		removeImages: false,
		api: '../slideshow/php/slideshow.php'
	});
};