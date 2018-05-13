'use strict';

var
rotateDynamicBlurb = function rotateDynamicBlurb(blurbs, i) {
	var str = blurbs[i],
	    curI = 1,
	    curStr = $$('.sidebar__blurb--dynamic').textContent,
	    newStr = str.slice(0, curI),
	    unTypeInt = void 0,
	    typeInt = void 0;

	setTimeout(function () {
		unTypeInt = setInterval(function () {
			if ($$('.sidebar__blurb--dynamic').textContent.length) {
				$$('.sidebar__blurb--dynamic').textContent = $$('.sidebar__blurb--dynamic').textContent.slice(0, $$('.sidebar__blurb--dynamic').textContent.length - 1);
			} else {
				clearInterval(unTypeInt);
				typeInt = setInterval(function () {
					if ($$('.sidebar__blurb--dynamic').innerHTML.length < str.length) {
						$$('.sidebar__blurb--dynamic').innerHTML = str.slice(0, curI);
						++curI;
					} else {
						clearInterval(typeInt);
						if (i < blurbs.length - 1) {
							rotateDynamicBlurb(blurbs, i + 1);
						} else {
							rotateDynamicBlurb(blurbs, 0);
						}
					}
				}, 50);
			}
		}, 50);
	}, 3000);
},
initDynamicBlurb = function initDynamicBlurb() {
	var BLURBS = [
		'Winter is <strike>coming</strike> here.',
		'These violent delights have violent ends.',
		'Don\'t turn your back. Don\'t look away. And don\'t blink.',
		'Saving people. Hunting things. The family business.',
		'Stay in the house, Carl.', 'We are fsociety.',
		'Don\'t forget to smile.',
		'The law is hard, but it is the law.',
		'The world is quiet here.'
	];

	$$('.sidebar__blurb--dynamic').addClass('dontBlink');

	rotateDynamicBlurb($$.rand(BLURBS), 0);
},
diagonalCardLoad = function diagonalCardLoad() {
	var row = 1,
	    col = 1;

	$$('.content__card').css('opacity', '0');
	$$('.content__card').css('transform', 'scale(0.8)');
	$$('.content__card').css('transition', 'opacity 0.5s, transform 0.5s, box-shadow 0.3s', 100);

	setTimeout(function () {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			var _loop = function _loop() {
				var card = _step.value;

				var anim = row + col;
				card.style.transitionDelay = 150 * anim + 'ms';
				setTimeout(function () {
					card.style.opacity = 1;
					card.style.transform = 'scale(1)';

					setTimeout(function () {
						card.style.transitionDelay = '0s';
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
			};

			for (var _iterator = $$('.content__card')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				_loop();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}, 100);
},
initFns = function initFns() {
	diagonalCardLoad();
	initDynamicBlurb();
};

if (document.readyState == 'complete') {
  initFns();
} else {
  document.addEventListener('readystatechange', function () { if (document.readyState == 'complete') initFns(); });
}
