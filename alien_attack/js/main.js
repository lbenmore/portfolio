const CONTROLS = {
	left: document.querySelector('.controls__button--left'),
	right: document.querySelector('.controls__button--right'),
	fire: document.querySelector('.controls__button--fire')
};

const HTML = {
	gameOver: `
		<button class="modal__button modal__button--neutral" style="margin-top: 240px;" onclick="newGame()">
			<span>Play Again</span>
		</button>
	`,
	player: `
		<div class="spaceship">
			<div class="spaceship__dome"></div>
			<div class="spaceship__body spaceship__body--top"></div>
			<div class="spaceship__body spaceship__body--ring"></div>
			<div class="spaceship__body spaceship__body--bottom"></div>
			<div class="spaceship__legs">
				<div class="spaceship__leg"></div>
				<div class="spaceship__leg"></div>
				<div class="spaceship__leg"></div>
				<div class="spaceship__leg"></div>
			</div>
		</div>
	`,
	villains: [
		`
			<div class="alien alien--1">
				<div class="alien__top">
					<span></span>
					<span></span>
				</div>
				<div class="alien__body"></div>
				<div class="alien__bottom"></div>
			</div>
		`,
		`
			<div class="alien alien--2">
				<div class="alien__top">
					<span></span>
				</div>
				<div class="alien__body">
					<span></span>
					<span></span>
				</div>
				<div class="alien__bottom">
					<span></span>
					<span></span>
				</div>
			</div>
		`,
		`
			<div class="alien alien--3">
				<div class="alien__top">
					<span></span>
					<span></span>
				</div>
				<div class="alien__body">
					<div class="alien__arm"></div>
					<span></span>
					<span></span>
					<div class="alien__arm"></div>
				</div>
				<div class="alien__bottom"></div>
			</div>
		`,
		`
			<div class="alien alien--4">
				<div class="alien__body">
					<span></span>
					<div class="alien__arm"></div>
					<div class="alien__arm"></div>
				</div>
				<div class="alien__bottom">
					<span>
						<span></span>
					</span>
					<span>
						<span></span>
					</span>
				</div>
			</div>
		`,
		`
			<div class="alien alien--5">
				<div class="alien__top">
					<div class="alien__arm"></div>
					<div class="alien__arm"></div>
				</div>
				<div class="alien__bottom">
					<div class="alien__arm"></div>
					<div class="alien__arm"></div>
				</div>
			</div>
		`
	]
};

class PhaserBeam {
	constructor (player) {
		this.game = player.game;
		this.player = player;
		this.element = document.createElement('div');
		this.active = true;

		this.generate();
		this.animate();
	}

	checkForCollision () {
		for (const villain of this.game.villains) {
			const v = getComputedStyle(villain.element);
			const vBottom = parseInt(v.top) + parseInt(v.height);
			const vLeft = parseInt(v.left);
			const vRight = parseInt(v.left) + parseInt(v.width);
			const b = getComputedStyle(this.element);
			const bTop = parseInt(b.top);
			const bLeft = parseInt(b.left);
			const bRight = parseInt(b.left) + parseInt(b.width);

			if (
				bTop < vBottom
				&& ((bRight > vLeft && bRight < vRight)
				|| (bLeft < vRight && bLeft > vLeft))
			) {
				villain.clear();
				this.game.villains.splice(this.game.villains.indexOf(villain), 1);

				this.clear();

				if (!this.game.villains.length) {
					this.game.gameOver(true);
				}
			}
		}
	}

	clear () {
		this.active = false;
		this.element.parentNode.removeChild(this.element);
	}

	animate () {
		if (this.active) {
			const currTop = parseInt(getComputedStyle(this.element).top);
			const playerHeight = parseInt(getComputedStyle(this.player.element).height);

			if (currTop > (playerHeight * -1)) {
				this.element.style.top = `${currTop - 3}px`;
				this.checkForCollision();
				requestAnimationFrame(this.animate.bind(this));
			} else {
				this.element.parentNode.removeChild(this.element);
			}
		}
	}

	generate () {
		this.element.classList.add('boomy');
		this.element.style.left = parseInt(getComputedStyle(this.player.element).left) + (parseInt(getComputedStyle(this.player.element).width) / 2) + 'px';
		this.game.element.appendChild(this.element);
	}
}

class Character {
	constructor (game) {
		this.game = game;
		this.element = document.createElement('div');
		this.generate();
	}

	generate () {
		this.element.classList.add('character');
		this.game.element.appendChild(this.element);
	}
}

class Villain extends Character {
	constructor (game) {
		super(game);
		this.active = true;
		this.generateVillain();
		this.animate()
	}

	clear () {
		this.active = false;
		this.element.parentNode.removeChild(this.element);
	}

	checkForCollision () {
		const v = getComputedStyle(this.element);
		const vTop = parseInt(v.top);
		const vLeft = parseInt(v.left);
		const vWidth = parseInt(v.width);
		const vHeight = parseInt(v.height);
		const p = getComputedStyle(this.game.player.element);
		const pTop = parseInt(p.top);
		const pLeft = parseInt(p.left);
		const pWidth = parseInt(p.width);
		const pHeight = parseInt(p.height);

		if (
			vTop + vHeight > pTop
			&& ((vLeft + vWidth > pLeft && vLeft < pLeft + pWidth)
			|| (vLeft < pLeft + pWidth && vLeft > pLeft))
		) {
			this.game.gameOver();
		}
	}

	animate () {
		if (this.active) {
			const currTop = parseInt(getComputedStyle(this.element).top);

			if (currTop < this.game.height) {
				this.element.style.top = `${currTop + 1}px`;
				this.checkForCollision();
				setTimeout(requestAnimationFrame, 0, this.animate.bind(this));
			} else {
				this.game.villains.splice(this.game.villains.indexOf(this), 1);
				this.element.parentNode.removeChild(this.element);

				this.game.villains.push(new Villain(this.game));
			}
		}
	}

	generateVillain () {
		const vWidth = parseInt(getComputedStyle(this.element).width);
		const vHtml = HTML.villains[Math.floor(Math.random() * HTML.villains.length)];

		this.element.classList.add('villain');
		this.element.innerHTML = vHtml;
		Object.assign(this.element.style, {
			left: `${Math.floor(Math.random() * this.game.width) - (vWidth / 2)}px`
		})
	}
}

class Player extends Character {
	constructor (game) {
		super(game);
		this.generatePlayer();
	}

	fire () {
		new PhaserBeam(this);
	}

	movePlayer (direction) {
		const currLeft = parseInt(getComputedStyle(this.element).left);
		if (
			(direction == 1 && currLeft < this.game.width)
			|| (direction == -1 && currLeft > 0)
		) {
			this.element.style.left = `${currLeft + (direction * 5)}px`;
		}

    if (this.game.isMobile && this.active) requestAnimationFrame(this.movePlayer.bind(this, direction));
	}

	onKeyUp () {
    this.active = false;

		this.element.classList.remove('flyLeft');
		this.element.classList.remove('flyRight');
	}

	onKeyDown (e) {
    this.active = true;

		switch (e.keyCode) {
			// left arrow
			case 37:
				this.element.classList.add('flyLeft');
				requestAnimationFrame(this.movePlayer.bind(this, -1));
			break;

			// right arrow
			case 39:
				this.element.classList.add('flyRight');
				requestAnimationFrame(this.movePlayer.bind(this, 1));
			break;

			// space
			case 32:
				this.fire();
			break;
		}
	}

	generatePlayer () {
		this.element.classList.add('player');
		this.element.innerHTML = HTML.player;
		addEventListener('keydown', this.onKeyDown.bind(this));
		addEventListener('keyup', this.onKeyUp.bind(this));

    if (this.game.isMobile) {
      this.game.controls.left.addEventListener('touchstart', this.onKeyDown.bind(this, {keyCode: 37}));
      this.game.controls.right.addEventListener('touchstart', this.onKeyDown.bind(this, {keyCode: 39}));
      this.game.controls.fire.addEventListener('touchstart', this.onKeyDown.bind(this, {keyCode: 32}));

      this.game.controls.left.addEventListener('touchend', this.onKeyUp.bind(this));
      this.game.controls.right.addEventListener('touchend', this.onKeyUp.bind(this));
      this.game.controls.fire.addEventListener('touchend', this.onKeyUp.bind(this));
    }
	}
}

class Star {
	constructor (background, i) {
		this.game = background.game;
		this.background = background;
		this.control = Math.round(Math.random() * 10) / 10;
		this.element = document.createElement('div');
		this.i = i;

		this.generate();
		this.animate();
	}

	animate () {
		const currTop = parseInt(getComputedStyle(this.element).top);

		if (currTop < this.game.height) {
			this.element.style.top = `${Math.round(currTop + 1)}px`;
		} else {
			this.element.style.top = '-1px';
		}

		setTimeout(requestAnimationFrame, (100 * (1 - this.control)), this.animate.bind(this));
	}

	generate () {
		this.background.element.appendChild(this.element);
		this.element.classList.add('star');
		Object.assign(this.element.style, {
			top: `${Math.floor(Math.random() * this.game.height)}px`,
			left: `${Math.floor(Math.random() * this.game.width)}px`,
			opacity: this.control
		});
	}
}

class Background {
	constructor (game) {
		this.game = game;
		this.element = document.createElement('div');
		this.stars = [];

		this.generate();
		this.populate();
	}

	populate () {
		let numStars = Math.floor(this.game.width * this.game.height / 1000);
		for (let i = numStars - 1; i >= 0; i--) {
			this.stars.push(new Star(this, i));
		}
	}

	generate () {
		this.element.classList.add('background');
		this.game.element.appendChild(this.element);
	}
}

class Game {
	constructor (target, mobile) {
		this.element = target;
		this.width = this.element.getBoundingClientRect().width;
		this.height = this.element.getBoundingClientRect().height;
		this.active = true;

    if (this.isMobile()) {
  		document.body.dataset.mobile = true;
      this.isMobile = true;
      this.controls = CONTROLS;
    } else {
      this.isMobile = false;
    }

		this.populate();
	}

	isMobile () {
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	confirm (msg, confirm, cancel, callback) {
		const overlay = document.createElement('div');
		const modal = document.createElement('div');

		overlay.classList.add('overlay');
		modal.classList.add('modal');

		modal.innerHTML = `
			<span class="modal__header">${msg}</span><br>
			<button class="modal__button modal__button--cancel"><span>${cancel}</span></button>
			<button class="modal__button modal__button--confirm"><span>${confirm}</span></button>
		`;

		this.element.appendChild(overlay);
		overlay.appendChild(modal);

		document.querySelector('.modal__button--cancel').addEventListener('click', callback.bind(this, false))
		document.querySelector('.modal__button--confirm').addEventListener('click', callback.bind(this, true))
	}

	gameOver (win) {
		let p;

		this.active = false;

		for (const v of this.villains) {
			// v.clear();
			v.active = false;
		}

		this.active = false;

		if (win) {
			this.confirm(
				'Yayyyy. You won. Congratulations.',
				'Play again',
				'Cool, let\'s do nothing now.',
				(response) => {
					if (response) {
						new Game(document.querySelector('.game'));
					} else {
						this.element.innerHTML = HTML.gameOver;
					}
				}
			);
		} else {
			this.confirm(
				'You suck, loser.',
				'Play again',
				'I\'ll just shove off then.',
				(response) => {
					if (response) {
						new Game(document.querySelector('.game'));
					} else {
						this.element.innerHTML = HTML.gameOver;
					}
				}
			);
		}
	}

	generateVillains () {
		this.villains = [];

		for (let i = 0; i < 10; i++) {
			(function (j, game) {
				setTimeout(function (game) {
					if (game.active) game.villains.push(new Villain(game))
				}, 1500 * j, game);
			})(i, this);
		}
	}

	generatePlayerOne () {
		this.player = new Player(this);
	}

	generateBkg () {
		this.background = new Background(this);
	}

	populate () {
		this.element.innerHTML = '';

		if (!this.isMobile) this.generateBkg();
		this.generatePlayerOne();
		this.generateVillains();
	}
}

function newGame () {
	new Game(document.querySelector('.game'));
}

newGame();

(function () {
	document.body.style.setProperty('--vh', Math.floor(innerHeight / 100) + 'px');
	console.log(document.body.style.getPropertyValue('--vh'));
	
	addEventListener('resize', function () {
		document.body.style.setProperty('--vh', Math.floor(innerHeight / 100) + 'px');
		console.log(document.body.style.getPropertyValue('--vh'));
	}());
})();
