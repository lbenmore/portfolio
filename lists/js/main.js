(function (win, doc) {
  function $$ (selector, forceArray) {
    const el = (selector instanceof HTMLElement) ? selector :
      forceArray || doc.querySelectorAll(selector).length > 1 
        ? Object.keys(doc.querySelectorAll(selector)).map(x => doc.querySelectorAll(selector)[x])
        : doc.querySelector(selector);

    const public = {};

    function evalTouchPoints (initEvt, evtName, cb) {
      const endEvt = initEvt.type === 'mousedown' ? 'mouseup' : 'touchend';

      this.addEventListener(endEvt, function () {
        const start = {}, end = {}, evt = {};

        start.x = (initEvt.changedTouches && initEvt.changedTouches[0].clientX) || initEvt.clientX;
        start.y = (initEvt.changedTouches && initEvt.changedTouches[0].clientY) || initEvt.clientY;
        end.x = (event.changedTouches && event.changedTouches[0].clientX) || event.clientX;
        end.y = (event.changedTouches && event.changedTouches[0].clientY) || event.clientY;

        for (const prop in event) {
          evt[prop] = event[prop];
        }
        evt.type = evtName;

        switch (evtName) {
          case 'swipeup':
            if (Math.abs(start.y - end.y) >= 80 && start.y > end.y) cb.call(this, evt);
            break;

          case 'swiperight':
            if (Math.abs(start.x - end.x) >= 80 && end.x > start.x) cb.call(this, evt);
            break;

          case 'swipedown':
            if (Math.abs(start.y - end.y) >= 80 && end.y > start.y) cb.call(this, evt);
            break;

          case 'swipeleft':
            if (Math.abs(start.x - end.x) >= 80 && start.x > end.x) cb.call(this, evt);
            break;
        }
      }, { once: true });
    }

    function initTouchPoints(evtName, cb) {
      el.addEventListener('mousedown', function () { evalTouchPoints.call(this, event, evtName, cb) });
      el.addEventListener('touchstart', function () { evalTouchPoints.call(this, event, evtName, cb) });
    }

    public.on = function (evt, cb) {
      switch (evt) {
        case 'swipeup':
        case 'swiperight':
        case 'swipedown':
        case 'swipeleft':
          if (el.length) {
            for (const element of el) {
              $$(element).on(evt, cb);
            }
          } else {
            initTouchPoints(evt, cb);
          }
          break;
        default:
          el.addEventListener(evt, cb);
          break;
      }
    };

    if (el) {
      for (const fn in public) {
        el[fn] = public[fn];
      }
    }

    return el;
  };

  const encode = win.btoa;
  const decode = win.atob;

  const hasLS = !!('localStorage' in win);

  function firstUnusedId (lists) {
    const ids = lists.map(list => list.id);
    const sorted = ids.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

    return Number(sorted.pop()) + 1;
  }

  function json (type, value, arr) {
    switch (type) {
      case 'parse':
        try {
          const json = JSON.parse(value);
          return json;
        } catch (e) {
          console.error(e);
          return arr ? [] : {};
        }

      case 'stringify':
        try {
          const str = JSON.stringify(value);
          return str;
        } catch (e) {
          console.error(e);
          return '';
        }
    }
  }

  function ls (type, key, value) {
    if (hasLS) {
      switch (type) {
        case 'set':
          return win.localStorage.setItem(key, value);

        case 'get':
          return win.localStorage.getItem(key);

        case 'remove':
          return win.localStorage.removeItem(key);

        case 'clear':
          return win.localStorage.clear();
      }
    } else {
      console.error('Local Storage API not available.');
    }
  }
  
  function toggleDarkMode (evt) {
    const dark = evt.target ? evt.target.checked : evt;
    const theme = dark && dark !== 'null' ? 'dark' : null;
    $$('body').dataset.theme = theme;
    $$('#toggleTheme').checked = !!theme;
    ls('set', 'theme', theme);
  }

  function handleMenu (toOpen) {
    if (toOpen === undefined) {
      if ($$('#toggleMenu').checked) $$('#toggleMenu').checked = null;
      else $$('#toggleMenu').checked = true;
    } else {
      $$('#toggleMenu').checked = toOpen ? true : null;
    }
  }

  function chooseDeleteList (lists, evt) {
    function onListSelect (selectEvt) {
      const list = lists.filter(x => x.id === Number(selectEvt.target.dataset.listId))[0];
      
      switch (evt.target.dataset.fn) {
        case "switch-list":
          const toList = lists.splice(lists.indexOf(list), 1)[0];
          lists.unshift(toList);
          break;

        case "delete-list":
          lists.splice(lists.indexOf(list), 1)[0];
          if (!lists.length) {
            lists.push({
              id: firstUnusedId(lists),
              name: 'New List',
              items: []
            });
          }
          break;
      }

      populateList(lists);
      handleMenu(false);
      overlay.parentNode.removeChild(overlay);
      ls('set', 'lists', encode(json('stringify', lists)));
    }

    function createListLink (list) {
      const span = doc.createElement('span');
      span.textContent = list.name;
      span.dataset.listId = list.id;
      return span.outerHTML;
    }

    const overlay = doc.createElement('div');
    const lightboxHtml = `
      <div class='lightboxContainer'>
        <div class='lightbox'>
          ${ lists.map(list => createListLink(list)).join('<br>') }
        </div>
      </div>
    `;

    overlay.classList.add('overlay');
    overlay.innerHTML = lightboxHtml;

    $$('body').appendChild(overlay);

    $$('.lightbox span', true).forEach(link => {
      link.addEventListener('click', onListSelect);
    });

    $$('.overlay').addEventListener('click', function () {
      if (event.target === $$('.lightboxContainer')) {
        overlay.parentNode.removeChild(overlay);
        handleMenu(false);
      }
    });
  }

  function createNewList (lists) {
    lists.unshift({
      id: firstUnusedId(lists),
      name: 'New List',
      items: []
    });

    populateList(lists);
    handleMenu(false);
  }

  function getItemIndex (el) {
    const chdn = el.parentNode.children;
    const arrChdn = Object.keys(chdn).map(x => chdn[x]);
    const i = arrChdn.indexOf(el);
    return i;
  }

  function crossOutItemLine (lists, evt) {
    const content = evt.target.innerHTML;
    const textContent = content.match(/<s>(.*)<\/s>/);
    const newContent = textContent ? textContent[1] : '<s>' + content + '</s>';
    const i = getItemIndex(evt.target);

    lists[0].items.splice(i, 1, newContent);
    ls('set', 'lists', encode(json('stringify', lists)));

    evt.target.innerHTML = newContent;
    evt.target.blur();
  }

  function deleteItemLine (lists, evt) {
    const i = getItemIndex(evt.target);

    lists[0].items.splice(i, 1);
    ls('set', 'lists', encode(json('stringify', lists)));

    evt.target.parentNode.removeChild(evt.target);
  }

  function addNewItemLine (lists, value) {
    const newItem = doc.createElement('li');

    if (value) newItem.innerHTML = value;
    else newItem.classList.add('add-icon');

    newItem.setAttribute('contenteditable', 'true');
    newItem.addEventListener('keydown', function () {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        newItem.parentNode.querySelectorAll('li[contenteditable]:last-of-type')[0].focus();
      }
    });

    $$('section ul').appendChild(newItem);
    $$(newItem).on('input', updateListItem.bind(this, lists));
    $$(newItem).on('swiperight', crossOutItemLine.bind(this, lists));
    $$(newItem).on('swipeleft', deleteItemLine.bind(this, lists));
  }

  function updateListItem(lists, evt) {
    const i = getItemIndex(evt.target);

    if (evt.target.textContent) {
      evt.target.classList.remove('add-icon');

      if (!$$('.add-icon', true).length) addNewItemLine(lists);

      lists[0].items[i] = evt.target.textContent;
    } else {
      evt.target.classList.add('add-icon');
      for (let ii = i, len = chdn.length - 1; ii < len; ii++) {
        evt.target.parentNode.children[ii].remove();
      }
      lists[0].items.splice(i, 1);
      $$('section li[contenteditable]:last-of-type').focus();
    }

    ls('set', 'lists', encode(json('stringify', lists)));
  }

  function updateListName (lists, evt) {
    const name = (evt && evt.target && evt.target.textContent);
    
    lists[0].name = name;
    ls('set', 'lists', encode(json('stringify', lists)));
  }

  function populateList (lists) {
    $$('section h1').textContent = lists[0].name;
    $$('section ul').innerHTML = '';

    lists[0].items.forEach(function (item) {
      addNewItemLine(lists, item);
    });

    addNewItemLine(lists);
  }

  function eventListeners (currentLists) {
    let lists = currentLists;

    if (!lists) {
      lists = [
        {
          "id": 100000,
          "name": "New List",
          "items": []
        }
      ];
    }

    populateList(lists);

    $$('section h1[contenteditable]').addEventListener('input', updateListName.bind(this, lists));

    $$('[data-fn="new-list"]').addEventListener('click', createNewList.bind(this, lists));
    $$('[data-fn="switch-list"], [data-fn="delete-list"]').forEach(function (link) {
      link.addEventListener('click', chooseDeleteList.bind(this, lists));
    });
    $$('#toggleTheme').addEventListener('input', toggleDarkMode);
  }

  function init () {
    const lists = ls('get', 'lists');
    const decoded = lists && decode(lists);
    const parsed = decoded && json('parse', decoded);
    const theme = ls('get', 'theme');

    if (theme) toggleDarkMode(theme);

    eventListeners(parsed);
  }

  if (doc.readyState === 'complete') {
    init();
  } else {
    doc.addEventListener('DOMContentLoaded', init);
  }
})(window, window.document);