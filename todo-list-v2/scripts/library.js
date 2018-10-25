// JavaScript Document

let
lists = [],
currList,
keyTimeout = null;

const
ls = (type, key, value) => {
	try {
		let output;
		switch (type) {
			case 'get':
				output = localStorage.getItem(key);
				if (output && output != 'undefined') {
					return output;
				} else {
					return false;
				}
			break;

			case 'set':
				if (typeof value != 'string') value = JSON.stringify(value);
				localStorage.setItem(key, value);
			break;

			case 'clear':
				localStorage.clear();
			break;
		}
	} catch (e) {
		console.error(e.message);
		return false;
	}
},

updateFilter = (e) => {
	switch (e.target.value) {
		case 'all':
			$$('.list__item').removeClass('hide');
		break;

		case 'active':
			$$('.list__item').removeClass('hide');
			setTimeout(() => {
				for (let checkbox of $$('.list__item input[type=checkbox]')) {
					if (checkbox.checked || checkbox.nextSibling.nextSibling.value == '') {
						checkbox.parentNode.classList.add('hide');
					}
				}
			});
		break;

		case 'completed':
			$$('.list__item').addClass('hide');
			setTimeout(() => {
				for (let checkbox of $$('.list__item input[type=checkbox]:checked')) {
					checkbox.parentNode.classList.remove('hide');
				}
			});
		break;
	}
},

updateList = (e) => {
	let newListObj;
	switch (e.target) {
		case $$('header span:nth-of-type(1)'):
			if (currList > 0) {
				--currList;
			} else {
				currList = lists.length - 1;
			}

			$$('header span:nth-of-type(2)').innerHTML = '&gt;';
		break;

		case $$('header span:nth-of-type(2)'):
			if (currList == lists.length - 1) {
				let newListObj = {};
				newListObj.name = 'New List';
				newListObj.items = [];
				lists.push(newListObj);
				ls('set', 'lists', lists);
			}
			++currList;
		break;
	}

	populateList(lists[currList]);
}

updateListName = (e) => {
	lists[currList].name = e.target.value;
	ls('set', 'lists', lists);
},

updateListItem = (e) => {
	let i = e.target.previousSibling.getAttribute('for').split('--')[1];

	if (lists[currList].items[i]) {
		lists[currList].items[i].value = e.target.value;
	} else {
		let
		existingId = lists[currList].items.filter((item) => {
			return item.id == i;
		}),
		newId;

		if (existingId.length) {
			newId = 0;
			while ( lists[currList].items.filter((item) => { return item.id == newId; }).length ) {
				++newId;
			}
		} else {
			newId = i;
		}

		lists[currList].items.push({
			id: newId,
			value: e.target.value,
			checked: false
		});
	}

	ls('set', 'lists', lists);
},

deleteListItem = (e) => {
	let
	i = e.target.previousSibling.previousSibling.getAttribute('for').split('--')[1],
	_listItem = lists[currList].items.filter((item) => {
		return item.id == i;
	})[0];

	$$('.list__container').removeChild($$(`.list__item--${i}`));

	lists[currList].items.splice(lists[currList].items.indexOf(_listItem), 1);
	ls('set', 'lists', lists);

},

updateCheckedItem = (e) => {
	let i = e.target.getAttribute('id').split('--')[1];

	if (lists[currList].items[i]) lists[currList].items[i].checked = e.target.checked;
	ls('set', 'lists', lists);
},

populateList = (listObj) => {
	let list = document.createElement('ul');

	lists.forEach((list, i) => {
		if (list.name == listObj.name) currList = i;
	});

	$$('.header input').value = listObj.name;

	if (currList == lists.length - 1) {
		$$('header span:nth-of-type(2)').innerHTML = '+';
	} else {
		$$('header span:nth-of-type(2)').innerHTML = '&gt;';
	}

	if (lists.length > 1) {
		$$('header span:nth-of-type(1)').removeClass('hide');
	}

	$$('.list').innerHTML = '';

	list.classList.add('list__container');
	$$('.list').appendChild(list);

	for (let i = 0; i < Math.max(listObj.items.length + 1, 10); i++) {
		let
		itemObj = $$.exists(listObj.items[i]) ? listObj.items[i] : {},
		item = document.createElement('li'),
		label = document.createElement('label'),
		chk = document.createElement('input'),
		input = document.createElement('input'),
		x = document.createElement('span'),
		objListItem = {};

		item.classList.add('list__item');
		item.classList.add(`list__item--${i}`)

		label.classList.add('list__label');
		label.setAttribute('for', `list__chk--${i}`);

		chk.classList.add('list__chk');
		chk.setAttribute('type', 'checkbox');
		chk.setAttribute('id', `list__chk--${i}`);
		if (itemObj.hasOwnProperty('checked')) {
			if (itemObj.checked) chk.setAttribute('checked', 'checked');
		}
		chk.onchange = updateCheckedItem;

		input.setAttribute('type', 'text');
		if (itemObj.hasOwnProperty('value')) input.setAttribute('value', itemObj.value);
		input.onchange = updateListItem;

		x.classList.add('list__delete');
		x.innerHTML = 'X';
		x.onclick = deleteListItem;

		list.appendChild(item);
		item.appendChild(chk);
		item.appendChild(label);
		item.appendChild(input);
		item.appendChild(x);
	}
},

initList = () => {
	if ($$.exists(ls('get', 'lists'))) {
		lists = JSON.parse(ls('get', 'lists'));
	} else {
		let newListObj = {};
		newListObj.name = 'New List';
		newListObj.items = [];
		lists.push(newListObj);
	}

	populateList(lists[0]);
}

eventListeners = () => {
	$$('header input').onchange = updateListName;
	$$('footer input[type=radio]').on('change', updateFilter);
	$$('header span').on('tap', updateList);
	addEventListener('keyup', (e) => {
		switch (e.keyCode) {
			case 13:
				if (e.target == $$('.list__item:last-of-type input[type=text]')) {
					populateList(lists[currList]);
					$$('.list__item:last-of-type input[type=text]').focus();
				}
			break;

			case 9:
				if (e.target == $$('.list__item:last-of-type input[type=text]')) {
					populateList(lists[currList]);
					$$('.list__item:last-of-type input[type=text]').focus();
				}
			break;
		}
	})
},

initFns = () => {
	eventListeners();
	initList();
};

document.addEventListener('DOMContentLoaded', initFns);
