(function (win, doc) {
  const $$ = (selector, forceArray) => {
    return forceArray || doc.querySelectorAll(selector).length > 1 
      ? Object.keys(doc.querySelectorAll(selector)).map(x => doc.querySelectorAll(selector)[x])
      : doc.querySelector(selector);
  };

  const encode = win.btoa;
  const decode = win.atob;

  const hasLS = !!('localStorage' in win);

  let to;

  function firstUnusedId (lists) {
    let id = 0;

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].id > id) {
        const list = lists.filter(x => x.id === id);
        id = lists[i].id;
        if (!list.length); return id;
      }
    }

    return 100000;
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

  function addNewItemLine (lists, value) {
    const newItem = doc.createElement('li');

    if (value) newItem.textContent = value;
    else newItem.classList.add('add-icon');

    newItem.setAttribute('contenteditable', 'true');
    newItem.addEventListener('input', updateListItem.bind(this, lists));

    $$('section ul').appendChild(newItem);
  }

  function updateListItem (lists, evt) {
    evt.target.classList.remove('add-icon');

    if (!$$('.add-icon', true).length) addNewItemLine(lists);

    to = setTimeout(function () {
      const chdn = Object.keys(evt.target.parentNode.children).map(x => evt.target.parentNode.children[x]);
      const i = chdn.indexOf(evt.target);
      lists[0].items[i] = evt.target.textContent;
      console.log(lists);
      ls('set', 'lists', encode(json('stringify', lists)));
    }, 750);
  }

  function updateListName (lists, evt) {
    clearTimeout(to);

    const name = (evt && evt.target && evt.target.textContent) || 'New List';
    
    to = setTimeout(function () {
      lists[0].name = name;
      console.log(lists);
      ls('set', 'lists', encode(json('stringify', lists)));
    }, 750);
    
    evt.target.textContent = name;
  }

  function eventListeners (currentLists) {
    let lists = currentLists;

    if (lists) {
      $$('section h1').textContent = lists[0].name;
      lists.forEach(function (list) {
        list.items.forEach(function (item) {
          addNewItemLine(lists, item);
        });
      });
    } else {
      lists = [
        {
          "id": 100000,
          "name": "New List",
          "items": []
        }
      ];
    }

    addNewItemLine(lists);

    $$('section h1[contenteditable]').addEventListener('input', updateListName.bind(this, lists));
  }

  function init () {
    const fromLs = ls('get', 'lists');
    const decoded = fromLs && decode(fromLs);
    const parsed = decoded && json('parse', decoded);
    eventListeners(parsed);
  }

  if (doc.readyState === 'complete') {
    init();
  } else {
    doc.addEventListener('DOMContentLoaded', init);
  }
})(window, window.document);