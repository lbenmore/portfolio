(function (win, doc) {
	var debug = !1;
	var console = win.console;
	var html = {
		notes: '<tr><td contenteditable="true" data-note-id="{{NOTE_ID}}">{{NOTE}}</td><td width="1px"><button class="btn btn--board btn--notes btn--delete" data-note-id="{{NOTE_ID}}">X</button></td></tr>',
		files: '<tr><td>{{FILE_NAME}}</td><td width="1px"><a href="./files/{{USER_ID}}/{{FILE_NAME}}" download="{{FILE_NAME}}" target="_blank"><button class="btn btn--board btn--files btn--download">Ø</button></a></td><td width="1px"><button class="btn btn--board btn--files btn--delete" data-user-id="{{USER_ID}}" data-file-name="{{FILE_NAME}}">X</button></td></tr>'
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
			switch (type) {
				case 'json':
					try {
						result = JSON.parse(xhr.responseText);
								
						if (result.status) {
							debug && console.log(result.message);
							callback && callback.call(this, result);
						} else {
							if (result.error) console.error(result.error);
							else {
								console.error('Unknown error occurred');
							}
							
							options.onerror && options.onerror.call(this, result);
						}
					} catch (e) {
						console.error('Error parsing response from XHR', e, xhr.responseText);
						result = xhr.responseText;
					}
					break;

				default:
					result = xhr.responseText;
					callback && callback.call(null, result);
					break;
			}
			
			if (options.debug) console.log(result);
		});
		
		xhr.addEventListener('error', function (err) {
			$$('.curtain').style.display = 'none';
			onError.call(this, err);
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
		if (darkMode) {
			doc.body.style.backgroundColor = '#222';
			doc.body.style.color = 'white';
			$$('header nav div').style.backgroundColor = '#222';
			$$('header nav div').style.color = 'white';
			$$('.curtain').style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
			$$('#toggleDarkMode').checked = true;
		} else {
			doc.body.style.backgroundColor = 'white';
			doc.body.style.color = 'black';
			$$('header nav div').style.backgroundColor = 'white';
			$$('header nav div').style.color = 'black';
			$$('.curtain').style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
			$$('#toggleDarkMode').checked = null;
		}

		return ls('set', 'darkmode', darkMode);
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
	
	function downloadFile (user, fileName) {
		var a = doc.createElement('a');
		
		a.setAttribute('download', fileName);
		a.setAttribute('href', './files/' + user.user_id + '/' + fileName);
		
		a.click();
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
						$$('.section__section--files div').dataset.error = 'File(s) could not be uploaded';
						$$('.files__progress').style.display = 'none';
						$$('.files__progress span').style.width = '0%';
						setTimeout(function () {
							$$('.section__section--files div').dataset.error = '';
						}, 3000);
					},
					onprogress: function (evt) {
						$$('.files__progress').style.display = 'block';
						$$('.files__progress span').style.width = (evt.loaded / evt.total * 100) + '%';
					}
				}, function () {
					$$('.files__progress').style.display = 'none';
					$$('.files__progress span').style.width = '0%';
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
			
			$$('.board__list--files .btn--download', true).forEach(function (btnDownload) {
				// btnDownload.onclick = downloadFile.bind(this, user, btnDownload.dataset.fileName);
			});
			
			$$('.board__list--files .btn--delete', true).forEach(function (btnDelete) {
				btnDelete.onclick = deleteFile.bind(this, user, btnDelete.dataset.fileName);
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
				case 'darkmode':
					darkModeHandler(currentLs[key] === 'true');
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
			onSuccessfulSignIn(res.user);
		});
	}

	function init () {
		checkForLoggedIn();
		eventListeners();
		getLsOptions();
	}

	if (doc.readyState === 'complete') {
		init();
	} else {
		doc.addEventListener('DOMContentLoaded', init);
	}
})(window, document);