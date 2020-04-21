(function (win, doc) {
  const $$ = (selector, forceArray) => {
    return forceArray || doc.querySelectorAll(selector).length > 1 
      ? Object.keys(doc.querySelectorAll(selector)).map(x => doc.querySelectorAll(selector)[x])
      : doc.querySelector(selector);
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

  function addNewItemLine (lists, value) {
    const newItem = doc.createElement('li');

    if (value) newItem.textContent = value;
    else newItem.classList.add('add-icon');

    newItem.setAttribute('contenteditable', 'true');
    newItem.addEventListener('keydown', function () {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        newItem.parentNode.querySelectorAll('li[contenteditable]:last-of-type')[0].focus();
      }
    });
    newItem.addEventListener('input', updateListItem.bind(this, lists));

    $$('section ul').appendChild(newItem);
  }

  function updateListItem(lists, evt) {
    const chdn = Object.keys(evt.target.parentNode.children).map(x => evt.target.parentNode.children[x]);
    const i = chdn.indexOf(evt.target);

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