const
rotateDynamicBlurb = (blurbs, i) => {
	let
	str = blurbs[i],
	curI = 1,
	curStr = $$('.sidebar__blurb--dynamic').textContent,
	newStr = str.slice(0, curI),
	unTypeInt,
	typeInt;

	setTimeout(() => {
		unTypeInt = setInterval(() => {
			if ($$('.sidebar__blurb--dynamic').textContent.length) {
				$$('.sidebar__blurb--dynamic').textContent = $$('.sidebar__blurb--dynamic').textContent.slice(0, $$('.sidebar__blurb--dynamic').textContent.length - 1);
			} else {
				clearInterval(unTypeInt);
				typeInt = setInterval(() => {
					if ($$('.sidebar__blurb--dynamic').innerHTML.length < str.length) {
						$$('.sidebar__blurb--dynamic').innerHTML = str.slice(0, curI);
						++curI;
					} else {
						clearInterval(typeInt);
						if (i < blurbs.length - 1) {
							rotateDynamicBlurb(blurbs, (i + 1));
						} else {
							rotateDynamicBlurb(blurbs, 0);
						}
					}
				}, 50);
			}
		}, 50);
	}, 3000);
},

initDynamicBlurb = () => {
	const BLURBS = [
		'Winter is <strike>coming</strike> here.',
		'These violent delights have violent ends.',
		'Don\'t turn your back. Don\'t look away. And don\'t blink.',
		'Saving people. Hunting things. The family business.',
		'Stay in the house, Carl.',
		'We are fsociety.',
		'Don\'t forget to smile.',
		'The law is hard, but it is the law.',
		'The world is quiet here.',
		'Watch closely.',
		'Nolite te bastardes carborundorum.',
		'You\'re gonna die in there.',
		'Wheels up.',
		'Magic always comes with a price.',
		'I want to testify.',
		'Hope is undiscovered disappointment.'
	];

	$$('.sidebar__blurb--dynamic').addClass('dontBlink');

	rotateDynamicBlurb($$.rand(BLURBS), 0);
},

diagonalCardLoad = () => {
	let
	row = 1,
	col = 1;

	$$('.content__card').css('opacity', '0');
	$$('.content__card').css('transform', 'scale(0.8)');
	$$('.content__card').css('transition', 'opacity 0.5s, transform 0.5s', 100);

	setTimeout(() => {
		for (let card of $$('.content__card')) {
			let anim = row + col;
			card.style.transitionDelay = `${150 * anim}ms`;
			setTimeout(() => {
				card.style.opacity = 1;
				card.style.transform = 'scale(1)';

				setTimeout(() => {
					card.style.transition = 'opacity 0.5s, transform 0.3s, box-shadow 0.3s';
					// card.style.transitionDelay = '0s';
				}, 100 * anim + 100);
			}, 100);

			if (innerWidth < 820) {
				++col;
				++row;
			} else if (innerWidth < 1280) {
				if (col < 2) {
					++col;
				} else {
					col = 1;
					++row;
				}
			} else if (innerWidth < 1920) {
				if (col < 3) {
					++col;
				} else {
					col = 1;
					++row;
				}
			} else if (innerWidth > 1920) {
				if (col < 4) {
					++col;
				} else {
					col = 1;
					++row;
				}
			}
		}
	}, 100);
},

initFns = () => {
	diagonalCardLoad();
	initDynamicBlurb();
};

if (document.readyState == 'complete') {
  initFns();
} else {
  document.addEventListener('readystatechange', () => { if (document.readyState == 'complete') initFns(); });
}
