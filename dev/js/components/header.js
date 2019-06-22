'use strict';

core.controllers.Header = () => {
  const mainPages = Object.keys(core.pages).filter((page) => !core.pages[page].hasOwnProperty('parent'));
  let subPages = [];

  for (const page in core.pages) {
    if (location.hash.slice(1) == page && core.pages[page].hasOwnProperty('subpages')) {
      subPages = core.pages[page].subpages;
    }

    if (core.pages[location.hash.slice(1)].hasOwnProperty('parent')) {
      subPages = core.pages[core.pages[location.hash.slice(1)].parent].subpages;
    }
  }

  for (const page of mainPages) {
    let a = document.createElement('a');

    a.href = `#${page}`;
    a.className = 'm-sm text-deco-none text-secondary text-sm';
    a.innerHTML = core.pages[page].name;

    $$('.nav--main').appendChild(a);
  }

  // for (const page of subPages) {
  //   let a = document.createElement('a');
  //
  //   a.href = `#${page}`;
  //   a.className = 'm-sm text-deco-none text-secondary text-xs';
  //   a.innerHTML = core.pages[page].name;
  //
  //   $$('.nav--sub').appendChild(a);
  // }



  const quotes = $$.rand([
    'And remember, smile.',
    'Winter is coming.',
    'Whatever you do, don\'t blink.',
    'Somewhere in America...',
    'Sorry, Mom; sorry, God.',
    'You\'re too f***ing...blond!',

  ]),

  backwardTypeAnim = (obj) => {
    obj.int = setInterval(() => {
      if (core.globals.pageTitle.length > 0) core.globals.pageTitle = core.globals.pageTitle.slice(0, -1);
      else {
        ++obj.active;
        clearInterval(obj.int);
        handleTypeAnim(obj);
      }
    }, 80);
  },

  forwardTypeAnim = (obj) => {
    const
    quote = obj.arr[obj.active],
    props = {
      len: quote.length,
      cur: 0
    };

    obj.int = setInterval(() => {
      if (core.globals.pageTitle.length < props.len) {
        core.globals.pageTitle += quote[props.cur];
        ++props.cur;
      } else {
        clearInterval(obj.int);
        setTimeout(backwardTypeAnim, 2000, obj);
      }
    }, 80);
  },

  handleTypeAnim = (obj) => {
    if (obj.active == obj.total) obj.active = 0;
    forwardTypeAnim(obj);
  },

  initTypeAnim = () => {
    const
    obj = {
      arr: quotes,
      active: 0,
      total: quotes.length,
      int: null
    },
    style = document.createElement('style'),
    styles = `
      div[data-global='pageTitle']::after {
        content: '|';
        position: relative;
        margin-left: 2px;
        color: grey;
        animation-direction: alternate;
        animation-duration: 0.3s;
        animation-name: blink;
        animation-iteration-count: infinite;
      }

      @keyframes blink {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;

    style.innerHTML = styles;
    document.head.appendChild(style);

    core.globals.pageTitle = '';
    handleTypeAnim(obj);
    addEventListener('hashchange', () => {
      const thisInt = setInterval(() => {});
      for (let i = 0; i < thisInt; i++) clearInterval(i);
    });
  };

  initTypeAnim();
};
