(() => {
  const
  writeLetters = (els, index, callback) => {
    let letters = els[index].nodeName == '#text' ? els[index].nodeValue : els[index].innerHTML;
    letters = letters.split('');

    letters.forEach(function (letter, i) {
      const el = els[index].nodeName == '#text'
      	? document.createElement('span')
      	: document.createElement('a');

      el.style.opacity = '0';
      el.innerHTML = letter;
      if (els[index].href) el.href = els[index].href;

      setTimeout(() => {
        $$('.laptop__text').appendChild(el);
        el.style.opacity = '1';
      }, 80 * i);
    });

    setTimeout(prepareTyping, letters.length * 80, els, ++index, callback);
  },

  prepareTyping = (els, index, callback) => {
    if (index < els.length) {
      writeLetters(els, index, callback);
    } else {
      if (callback) callback.call();
    }
  },

  generateNav = (playAnim) => {
    let
    html = '',
    dummy = document.createElement('div'),
    chunks = [];

    html += 'addEventListener("load", () => {\n';
    html += '\t<a href="#/about">about();</a>\n';
    html += '\t<a href="#/projects">projects();</a>\n';
    html += '\t<a href="#/contact">contact();</a>\n';
    html += '});';

    if (playAnim) {
      dummy.innerHTML = html;
      chunks = dummy.childNodes;

      $$('.laptop__text').innerHTML = '';

      prepareTyping(chunks, 0);
    } else {
      $$('.laptop__text').innerHTML = html;
    }
  }

  getTime = () => {
    let
    now = new Date(),
    hours = now.getHours(),
    minutes = now.getMinutes(),
    days = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'],
    day = days[now.getDay()],
    meridian;

    meridian = hours > 11 ? 'pm' : 'am';

    if (hours > 12) hours -= 12;
    if (hours == 0) hours = 12;

    if (minutes < 10) minutes = `0${minutes}`;

    return `${day} ${hours}:${minutes} ${meridian.toUpperCase()}`;
  },

  animLaptop = (direction) => {
  	switch (direction) {
  		case 'open':
				$$('.laptop').animate({
	      	'transform': 'rotateX(0deg)'
       	}, 1000);
  		break;

  		case 'close':
	  		$$.ls('clear');

	      $$('.laptop').animate({
	        'transform': 'rotateX(-90deg)'
	      }, 1000);
  		break;
  	}
  }

  eventListeners = () => {
    $$('.laptop').on('swipedown', animLaptop.bind(null, 'close'));
    $$('.me').on('swipeup', animLaptop.bind(null, 'open'));

},

  initFns = () => {
    $$('.laptop__info').innerHTML = getTime();
    setInterval(() => {
      $$('.laptop__info').innerHTML = getTime();
    }, 1000);

    if ($$.ls('get', 'introHasPlayed')) {
      generateNav(false);
    } else {
    	$$('.laptop').css('transform', 'rotateX(-90deg)');

		  setTimeout(animLaptop, 1000, 'open');

		  setTimeout(generateNav, 2000, true);
			$$.ls('set', 'introHasPlayed', 'true');
    }

    eventListeners();
  };

  initFns();
})();
