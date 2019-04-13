(() => {
  const
  writeLetters = (els, index, callback) => {
    let letters = els[index].nodeName == '#text' ? els[index].nodeValue : els[index].innerHTML;
    letters = letters.split('');

    letters.forEach(function (letter, i) {
      const el = els[index].nodeName == '#text' ? document.createElement('span') : document.createElement('a');
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
    html = 'addEventListener("load", () => {\n';
    html += '\t<a href="#/projects">about();</a>\n';
    html += '\t<a href="#/projects">loadProjects();</a>\n';
    html += '\t<a href="#/projects">contact();</a>\n';
    html += '});',
    dummy = document.createElement('div'),
    chunks = [];

    if (playAnim) {
      dummy.innerHTML = html;
      chunks = dummy.childNodes;

      $$('.laptop__text').innerHTML = '';

      prepareTyping(chunks, 0, () => {
        console.log('fin');
      });
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

  initFns = () => {
    $$('.laptop__info').innerHTML = getTime();
    setInterval(() => {
      $$('.laptop__info').innerHTML = getTime();
    }, 1000);

    $$('main')
      .css('perspective', '100vh')
      .css('transform-style', 'preserve-3d');

    $$('.laptop')
      .css('transform' ,'rotateX(-90deg)')
      .css('transform-origin', '50% 100%')
      .animate({
        'transform': 'rotateX(0deg)'
      }, 2000, 500);

    // if ($$.ls('get', 'introHasPlayed')) {
    //   generateNav(false);
    // } else {
      setTimeout(generateNav, 2000, true);
      $$.ls('set', 'introHasPlayed', 'true');
    // }
  };

  initFns();
})();
