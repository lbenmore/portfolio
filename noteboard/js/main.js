(function (win, doc) {
	var debug = !1;
	var console = win.console;
	var html = {
		notes: '<tr><td contenteditable="true" data-note-id="{{NOTE_ID}}">{{NOTE}}</td><td width="1px"><button class="btn btn--board btn--notes btn--delete" data-note-id="{{NOTE_ID}}">X</button></td></tr>',
		files: '<tr><td contenteditable="true" data-file-name="{{FILE_NAME}}">{{FILE_NAME}}</td><td width="1px"><a href="./files/{{USER_ID}}/{{FILE_NAME}}" download="{{FILE_NAME}}" target="_blank"><button class="btn btn--board btn--files btn--download">Ø</button></a></td><td width="1px"><button class="btn btn--board btn--files btn--delete" data-user-id="{{USER_ID}}" data-file-name="{{FILE_NAME}}">X</button></td></tr>',
		passwordIcon: 'i'
	};
	var to;


	/**
	* Utility functions
	*/

	function $$ (selector, forceAll) {
		return forceAll || doc.querySelectorAll(selector).length > 1 ?
			Object.keys(doc.querySelectorAll(selector)).map(function (key) { return doc.querySelectorAll(selector)[key]; }) :
			doc.querySelector(selector);
	}

	function ajax (options, callback) {
		var type = options.type || 'json';
		var method = options.method || 'POST';
		var url = options.url || './php/app.php';
		var isAsync = options.async || true;
		var headers = options.headers || {};
		var params = options.params || {};
		var onProgress = options.onprogress || function () {};
		var onError = options.onerror || function () {};
		var xhr = new win.XMLHttpRequest();
		var fd = new win.FormData();
		var result;

		$$('.curtain').style.display = 'block';

		for (var param in params) {
			fd.append(param, params[param]);
		}

		xhr.addEventListener('load', function () {
			$$('.curtain').style.display = 'none';
			if (xhr.status === 200) {
				switch (type) {
					case 'json':
						try {
							result = JSON.parse(xhr.responseText);

							if (result.status) {
								debug && console.log(result.message);
								callback && callback.call(this, result);
							} else {
								if (result.error) console.error(result.error);
								else console.error('Unknown error occurred');

								onError.call(this, result);
							}
						} catch (e) {
							console.error('Error parsing response from XHR', e, xhr.responseText);
							result = xhr.responseText;
							onError.call(xhr, result);
						}
						break;

					default:
						result = xhr.responseText;
						callback && callback.call(null, result);
						break;
				}
			} else {
				switch (xhr.status) {
					case 413:
						onError.call(xhr, 'File size too large to upload');
						break;

					default:
						onError.call(xhr, 'Unhandled error occurred: ' + xhr.status);
						break;
				}
			}

			if (options.debug) console.log(result);
		});

		xhr.addEventListener('error', function (evt) {
			$$('.curtain').style.display = 'none';
			onError.call(this);
		});

		if (xhr.upload) xhr.upload.onprogress = onProgress;
		else xhr.onprogress = onProgress;

		xhr.open(method, url, isAsync);
		for (var header in headers) {
			xhr.setRequestHeader(header, headers[header]);
		}
		params ? xhr.send(fd): xhr.send();
	}

	function ls (type, key, value) {
		if ('localStorage' in win) {
			switch (type) {
				case 'set':
					typeof value === 'object' ?
						win.localStorage.setItem(key, JSON.stringify(value)) :
						win.localStorage.setItem(key, value);
					return ls('get', key);

				case 'get':
					return win.localStorage.getItem(key);

				case 'getAll':
					var result = {};
					var nativeProperties = [
						'length',
						'key',
						'getItem',
						'setItem',
						'removeItem',
						'clear'
					];

					for (var prop in win.localStorage) {
						if (nativeProperties.indexOf(prop) > -1) continue;
						result[prop] = win.localStorage[prop];
					}

					return result;

				case 'clear':
					win.localStorage.clear();
					return true;

				default:
					console.error('Something has gone awry while setting local storage!');
			}
		} else {
			console.error('Local Storage API not available.');
			return false;
		}
	}

	/**
	* Handler functions
	*/

	function darkModeHandler (darkMode) {
		const theme = darkMode && darkMode !== 'null' ? 'dark' : null;
		$$('body').dataset.theme = theme;
		$$('#toggleDarkMode').checked = theme;

		return ls('set', 'theme', theme);
	}

	/**
	* Navigation functions
	*/

	function triggerPageToggle (pageToggle) {
		var input = $$('#' +  pageToggle);

		$$('input[name=' + input.name + ']', true).forEach(function (input) {
			input.checked = null;
		});

		$$('#' + pageToggle).checked = true;

		$$('html').scrollTop = 0;
	}

	function destinationPageHandler (e) {
		var toggle = e.target.dataset.destinationPageToggle;
		triggerPageToggle(toggle);
	}

	/**
	* API functions
	*/

	function signoutUser () {
		ajax({
			params: {
				action: 'destroy_user_cookie'
			}
		}, function () {
			var userName = '';

			$$('body').dataset.isLoggedIn = false;

			$$('[data-error]', true).forEach(function (errEl) {
				errEl.dataset.error = '';
			});

			$$('.signin__form input', true).forEach(function (input) {
				input.value = '';
			});


			$$('.btn--add').onclick = null;
			$$('.btn--update', true).forEach(function (btnUpdate) {
				btnUpdate.onclick = null;
			});

			$$('.board__input--files').oninput = null;

			$$('[data-replace="user"]', true).forEach(function (el) {
				el.innerHTML = userName;
			});

			triggerPageToggle('toggleSignin');
		});
	}

	function updateProfile (user) {
		var columns = $$('[data-column]', true)
			.filter(function (input) {
				return !!input.value;
			})
			.map(function (input) {
				var result = {};
				result[input.dataset.column] = input.value;
				return result;
			});

		var params = {
			action: 'update_profile',
			user_id: user.user_id
		};

		function onSuccessfulUpdate (res) {
			$$('.main__section--profile form').dataset.success = 'Profile successfully updated!';
			win.setTimeout(function () {
				$$('.main__section--profile form').dataset.success = '';
			}, 3000);
			onSuccessfulSignIn(res.user, 'toggleProfile');
		}

		columns.forEach(function (col) {
			for (var prop in col) {
				params[prop] = col[prop];
			}
		});

		$$('.profile__input--password').parentNode.dataset.error = '';
		$$('.profile__input--emailAddress').parentNode.dataset.error = '';

		if ('email_address' in params) {
			if (
				params.email_address.indexOf('@') === -1 ||
				params.email_address.indexOf('.') < params.email_address.indexOf('@') ||
				params.email_address.length <= params.email_address.indexOf('.') + 1
			) {
				return $$('.profile__input--emailAddress').parentNode.dataset.error = 'Please provide a valid email address';
			}
		}

		if ('password' in params) {
			var pass = $$('.profile__input--password').value;
			var passConf = $$('.profile__input--passwordConf').value;
			var passOrig = $$('.profile__input--passwordOrig').value;

			if (pass === passConf) {
				ajax({
					params: {
						action: 'confirm_password',
						user_id: user.user_id,
						password: passOrig
					},
					onerror: function (res) {
						$$('.profile__input--password').parentNode.dataset.error = res.error || 'Unknown error occurred';
					}
				}, function () {
					ajax({ params: params }, onSuccessfulUpdate);
				});
			} else {
				$$('.profile__input--password').parentNode.dataset.error = 'Passwords do not match';
			}
		} else {
			ajax({ params: params }, onSuccessfulUpdate);
		}
	}

	function deleteFile (user, fileName) {
		ajax({
			params: {
				action: 'delete_file',
				user_id: user.user_id,
				file_name: fileName
			}
		}, function () {
			getFiles(user);
		});
	}

	function updateFile (user, input, evt) {
		clearTimeout(win.to);
		win.to = setTimeout(function () {
			ajax({
				debug: true,
				params: {
					action: 'update_file',
					user_id: user.user_id,
					current_file_name: evt.target.dataset.fileName,
					new_file_name: input.textContent
				}
			}, function (res) {
				getFiles(user);
			});
		}, 1000);
	}

	function addFile (user, evt) {
		var filesRaw = evt.target.files;
		var files = Object.keys(filesRaw).map(function (file) { return filesRaw[file]; });

		if (files.length) {
			files.forEach(function (file) {
				ajax({
					params: {
						action: 'add_file',
						user_id: user.user_id,
						file: file
					},
					onerror: function (err) {
						$$('.section__section--files div').dataset.error = err || 'File(s) could not be uploaded';
						$$('.curtain__progress').style.display = 'none';
						$$('.curtain__progress span').style.width = '0%';
						$$('.board__input--files').value = null;
						setTimeout(function () {
							$$('.section__section--files div').dataset.error = '';
						}, 3000);
					},
					onprogress: function (evt) {
						$$('.section__section--files div').dataset.error = '';
						$$('.curtain__progress').style.display = 'block';
						$$('.curtain__progress span').style.width = (evt.loaded / evt.total * 100) + '%';
					}
				}, function () {
					$$('.section__section--files div').dataset.error = '';
					$$('.curtain__progress').style.display = 'none';
					$$('.curtain__progress span').style.width = '0%';
					$$('.board__input--files').value = null;
					getFiles(user);
				});
			});
		}
	}

	function getFiles (user) {
		ajax({
			params: {
				action: 'get_files',
				user_id: user.user_id
			}
		}, function (res) {
			var files = res.files;

			$$('.board__list--files tbody').innerHTML = '';

			files.forEach(function (file) {
				$$('.board__list--files tbody').innerHTML += html.files.replace(/{{FILE_NAME}}/g, file).replace(/{{USER_ID}}/g, user.user_id);
			});

			$$('.board__list--files .btn--delete', true).forEach(function (btnDelete) {
				btnDelete.onclick = deleteFile.bind(this, user, btnDelete.dataset.fileName);
			});

			$$('.board__list--files [contenteditable="true"]', true).forEach(function (input) {
				input.oninput = updateFile.bind(this, user, input);
			});
		});
	}

	function deleteNote (user, noteId) {
		ajax({
			params: {
				action: 'delete_note',
				user_id: user.user_id,
				note_id: noteId
			}
		}, function () {
			getNotes(user);
		});
	}

	function updateNote (user, input) {
		win.clearTimeout(to);
		to = win.setTimeout(function () {
			ajax({
				debug: true,
				params: {
					action: 'update_note',
					user_id: user.user_id,
					note_id: input.dataset.noteId,
					note_content: win.btoa(input.textContent)
				}
			});
		}, 1000);
	}

	function addNote (user) {
		var inputNote = $$('.board__input--note');
		var note = win.btoa(inputNote.value);

		ajax({
			params: {
				action: 'add_note',
				user_id: user.user_id,
				note: note
			}
		}, function () {
			getNotes(user);
			$$('.board__input--note').value = '';
		});
	}

	function getNotes (user) {
		ajax({
			params: {
				action: 'get_notes',
				user_id: user.user_id
			}
		}, function (res) {
			var notes = res.notes;

			$$('.board__list--notes tbody').innerHTML = '';

			notes.length && notes.forEach(function (note) {
				$$('.board__list--notes tbody').innerHTML += html.notes.replace(/{{NOTE}}/g, win.atob(note.note_content)).replace(/{{NOTE_ID}}/g, note.note_id);
			});

			$$('.board__list--notes .btn--delete', true).forEach(function (btnDelete) {
				btnDelete.onclick = deleteNote.bind(this, user, btnDelete.dataset.noteId);
			});

			$$('.board__list--notes [contenteditable="true"]', true).forEach(function (input) {
				input.oninput = updateNote.bind(this, user, input);
			});
		});
	}

	function onSuccessfulSignIn (user, goToPage) {
		var userName = (user.first_name || user.last_name) ?
			((user.first_name || '') + ' ' + (user.last_name || '')).trim() :
			user.email_address;

		$$('body').dataset.isLoggedIn = true;

		$$('[data-error]', true).forEach(function (errEl) {
			errEl.dataset.error = '';
		});

		$$('.signin__form input', true).forEach(function (input) {
			input.value = '';
		});


		$$('.btn--add').onclick = addNote.bind(this, user);
		$$('.btn--update', true).forEach(function (btnUpdate) {
			btnUpdate.onclick = updateProfile.bind(this, user);
		});

		$$('.board__input--files').onchange = addFile.bind(this, user);

		$$('[data-replace="user"]', true).forEach(function (el) {
			el.innerHTML = userName;
		});

		getNotes(user);
		getFiles(user);
		triggerPageToggle(goToPage || 'toggleBoard');

		ajax({
			params: {
				action: 'set_user_cookie',
				user_id: user.user_id
			}
		});
	}

	function signinUser (evt, emailAddress, password) {
		var inputEmailAddress = $$('.form--signin input[type="email"]');
		var inputPassword = $$('.form--signin input[type="password"]');

		var eml = emailAddress || inputEmailAddress.value;
		var pwd = password || inputPassword.value;

		var form = inputEmailAddress.parentNode;

		if (eml && pwd) {
			ajax({
				params: {
					action: 'signin_user',
					email_address: eml,
					password: pwd
				},
				onerror: function (res) {
					form.dataset.error = res.error || 'Incorrect email address or password. Please try again or register';
				}
			}, function (res) {
				onSuccessfulSignIn(res.user);
			});
		}
	}

	function registerUser () {
		var inputEmailAddress = $$('.form--register input[type="email"]');
		var inputPassword = $$('.form--register input[type="password"]')[0];
		var inputPasswordConf = $$('.form--register input[type="password"]')[1];
		var form = inputEmailAddress.parentNode;

		var emailAddress = inputEmailAddress.value;
		var password = inputPassword.value;
		var passwordConf = inputPasswordConf.value;

		var isValid = false;

		form.dataset.error = '';

		if (
			emailAddress &&
			emailAddress.indexOf('@') > -1 &&
			emailAddress.indexOf('.') > emailAddress.indexOf('@') &&
			emailAddress.length > emailAddress.indexOf('.') + 1
		) {
			isValid = true;
		} else {
			return form.dataset.error = 'Please enter a valid email address';
		}

		if (password && password === passwordConf) {
			isValid = true;
		} else {
			return form.dataset.error = 'Passwords do not match';
		}

		if (isValid) {
			ajax({
				params: {
					action: 'register_user',
					email_address: emailAddress,
					password: password
				},
				onerror: function (res) {
					form.dataset.error = res.error || 'Could not create a new user';
				}
			}, function () {
				signinUser(null, emailAddress, password);
			});
		} else {
			console.error('Either the email address provided is invalid or passwords do not match');
		}
	}

	/**
	* Initialization
	*/

	function getLsOptions () {
		var currentLs = ls('getAll');
		if (!Object.keys(currentLs).length) return false;

		for (var key in currentLs) {
			switch (key) {
				case 'theme':
					darkModeHandler(currentLs[key] === 'dark');
					break;
			}
		}
	}

	function eventListeners () {
		$$('button', true).forEach(function (button) {
			button.addEventListener('click', function (evt) {
				evt.preventDefault();
			});
		});

		$$('.nav__label:not(.nav__label--darkmode)', true).forEach(function (navItem) {
			navItem.addEventListener('click', function () {
				$$('#toggleMenu').checked = null;
			});
		});

		$$('[data-destination-page-toggle]', true).forEach(function (button) {
			button.addEventListener('click', destinationPageHandler);
		});

		$$('.signin__btn--register').addEventListener('click', registerUser);
		$$('.signin__btn--signin').addEventListener('click', signinUser);

		$$('.nav__label--signout').addEventListener('click', signoutUser);

		$$('#toggleDarkMode').addEventListener('change', function () {
			darkModeHandler(!!this.checked);
		});
	}

	function checkForLoggedIn () {
		ajax({
			params: {
				action: 'get_user_cookie'
			}
		}, function (res) {
			if (!res.error) onSuccessfulSignIn(res.user);
		});
	}

	function addPasswordPeaks () {
		var inputs = $$('input[type="password"]', true);

		function handlePasswordViewToggle (input, evt) {
			switch (evt.type) {
				case 'mousedown':
				case 'touchstart':
					input.setAttribute('type', 'text');
					break;

				case 'mouseup':
				case 'touchend':
					input.setAttribute('type', 'password');
					break;
			}
		}

		function wrapPasswordInput (input) {
			var div = document.createElement('div');
			var span = document.createElement('span');

			div.className += ' passwordWrapper';
			input.className += ' passwordInput';
			span.className += ' passwordIcon';

			span.innerHTML = html.passwordIcon;

			input.parentNode.insertBefore(div, input);
			div.appendChild(input);
			div.appendChild(span);

			span.addEventListener('mousedown', handlePasswordViewToggle.bind(span, input));
			span.addEventListener('touchstart', handlePasswordViewToggle.bind(span, input));
			span.addEventListener('mouseup', handlePasswordViewToggle.bind(span, input));
			span.addEventListener('touchend', handlePasswordViewToggle.bind(span, input));
		}

		inputs.forEach(wrapPasswordInput);
	}

	function populateButtonsWithSvg () {
		var getTrash = new XMLHttpRequest();
		var getDownload = new XMLHttpRequest();
		var getEye = new XMLHttpRequest();

		getTrash.onload = function () {
			html.notes = html.notes.replace(/X/g, getTrash.responseText);
			html.files = html.files.replace(/X/g, getTrash.responseText);
		};

		getDownload.onload = function () {
			html.files = html.files.replace(/Ø/g, getDownload.responseText);
		};

		getEye.onload = function () {
			html.passwordIcon = getEye.responseText;
			$$('.passwordIcon', true).forEach(function (icon) {
				icon.innerHTML = getEye.responseText;
			});
		};

		getTrash.open('GET', './img/trash.php?width=12&height=12', true);
		getDownload.open('GET', './img/download.php?width=12&height=12', true);
		getEye.open('GET', './img/eye.php?width=16&height=16', true);

		getTrash.send();
		getDownload.send();
		getEye.send();
	}

	function init () {
		populateButtonsWithSvg();
		addPasswordPeaks();
		eventListeners();
		getLsOptions();
		checkForLoggedIn();
	}

	if (doc.readyState === 'complete') {
		init();
	} else {
		doc.addEventListener('DOMContentLoaded', init);
	}
})(window, document);
