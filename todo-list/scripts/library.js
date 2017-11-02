// JavaScript Document

let
todos = [],
items = null,
checkboxes = null,
texts = null,
i = 0;

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
}

updateTodos = () => {
	todos = [];
	for (let item of items) {
		if (item.querySelector('.list__text').value) {
			todos.push({
				'text': item.querySelector('.list__text').value,
				'isChecked': item.querySelector('.list__checkbox').checked
			});
		}
	}

	ls('set', 'todos', todos);
}

listItem = (id) => {
	return `
		<div class='list__item'>
			<input class='list__input list__checkbox' id='list__checkbox--${id}' type='checkbox'>
			<input class='list__input list__text' type='text' placeholder='&nbsp;'>
			<label class='list__label' for='list__checkbox--${id}'></label>
		</div>
	`
}

document.querySelector('.list').innerHTML = '';
while (i < 50) {
	document.querySelector('.list').innerHTML += listItem(i);
	++i;
}

items = document.querySelectorAll('.list__item');
checkboxes = document.querySelectorAll('.list__checkbox');
texts = document.querySelectorAll('.list__text');

for (let checkbox of checkboxes) {
	checkbox.addEventListener('change', updateTodos);
}

for (let text of texts) {
	text.addEventListener('blur', updateTodos);
}

if (ls('get', 'todos')) {
	let i = 0;
	todos = JSON.parse(ls('get', 'todos'));
	for (let todo of todos) {
		document.querySelectorAll('.list__text')[i].value = todo.text;
		if (todo.isChecked) {
			document.querySelectorAll('.list__checkbox')[i].setAttribute('checked', 'true');
		}
		++i;
	}
}
