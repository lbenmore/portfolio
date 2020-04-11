(function (w, d) {
	function $$ (selector, forceArray) {
		return forceArray || d.querySelectorAll(selector).length > 1
			? Object.keys(d.querySelectorAll(selector)).map(function (x) { return d.querySelectorAll(selector)[x]; })
			: d.querySelector(selector);
	}

	function ajax (options) {
		var type = options.type || 'json';
		var method = options.method || 'POST';
		var url = options.url || './php/app.php';
		var isAsync = options.async || true;
		var headers = options.headers || {};
		var params = options.params || {};
		var callback = options.callback || function () {};
		var onprogress = options.onprogress || function () {};
		var onerror = options.onerror || function () {};
		var xhr = new XMLHttpRequest();
		var fd = new FormData();

		for (var param in params) {
			fd.append(param, params[param]);
		}

		if (xhr.upload) xhr.upload.onprogress = onprogress;
		else xhr.onprogress = onprogress;

		xhr.onerror = onerror;

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var response;

					switch (type) {
						case 'json':
							try {
								response = JSON.parse(xhr.responseText);
							} catch (e) {
								onerror.call(xhr);
							}
							break;

						default:
							response = xhr.responseText;
							break;
					}

					callback.call(xhr, response);
				} else {
					onerror.call(xhr);
				}
			}
		};

		xhr.open(method, url, isAsync);
		for (var header in headers) {
			xhr.setRequestHeader(header, headers[header]);
		}
		Object.keys(params).length ? xhr.send(fd) : xhr.send();
	}
	
	function toggleDarkMode () {
		var currentTheme = $$('body').dataset.theme || '';
		if (currentTheme === 'dark') {
			$$('body').dataset.theme = '';
		} else {
			$$('body').dataset.theme = 'dark';
		}
		
		if ('localStorage' in w) {
			w.localStorage.setItem('theme', $$('body').dataset.theme);
		}
	}
	
	function clearMessage (timeout) {
		if (timeout) clearTimeout(timeout);
		this.className = this.className.replace('active', '');

		setTimeout(function (that) {
			that.parentNode.removeChild(that);
		}, 550, this);
	}
	
	function message (header, body, classes) {
		var div = document.createElement('div');
		var h3 = document.createElement('h3');
		var p = document.createElement('p');
		
		div.className = 'message ' + classes;
		
		h3.innerHTML = header;
		p.innerHTML = body;
		
		div.appendChild(h3);
		div.appendChild(p);
		
		$$('main').appendChild(div);
		setTimeout(function () {
			div.className += ' active';
			var to = setTimeout(clearMessage.bind(div), 4000);
			div.addEventListener('click', clearMessage.bind(div, to));
		}, 100);
	}
	
	function trimMatrix (matrix) {
		for (var row = matrix.length - 1; row >= 0; --row) {
			var allBlanks = true;
			for (var col = 0; col < matrix[row].length; ++col) {
				if (matrix[row][col]) allBlanks = false;
			}
			if (allBlanks) matrix.splice(row, 1);
		}
		
		return matrix;
	}

	function cleanupTmp () {
		ajax({
			params: {
				action: "cleanup_tmp"
			},
			onerror: function () {
				console.error(this.responseText);
				console.log(this);
			},
			callback: function (res) {
				console.log(res);
			}
		});
	}

	function downloadFile (filePath) {
		var a = document.createElement('a');
		var fileName = filePath.split('/').slice(-1).join('');

		a.setAttribute('target', '_blank');
		a.setAttribute('href', filePath);
		a.setAttribute('download', fileName);
		a.click();

		setTimeout(cleanupTmp, 500);
	}

	function exportData (matrix) {
		ajax({
			params: {
				action: 'export_data',
				matrix: JSON.stringify(trimMatrix(matrix))
			},
			callback: function (res) {
				console.log(res);
				if (res.status) {
					message('Success!', res.message, 'success');
					downloadFile(res.file_name);
				} else if (res.error) {
					message('Error', res.error, 'error');
				} else {
					message('Error', 'Unknown error occurred.', 'error');
					console.log(this);
				}
			}
		})
	}

	function importFromFile (curtain) {
		event.stopPropagation();

		var files = event.target.files;
		var file = files.length && files[0];

		$$('.curtain').style.display = 'none';

		if (file) {
			var ext = file.name.split('.').pop();

			if (ext.toLowerCase() !== 'csv') {
				message('Error', 'Please upload a valid csv file', 'error');
				return;
			}

			ajax({
				params: {
					action: 'import_data',
					file: file
				},
				callback: function (res) {
					console.log(res);
					if (res.status) {
						message('Success!', 'Your file was successfully imported to your data table. You\'re welcome.', 'success');
						populateTable(res.matrix);
					} else if (res.error) {
						message('Error', res.error, 'error');
					} else {
						message('Error', 'Unknown error has occurred.', 'error');
					}
				}
			})
		}
	}
	
	function importFromLocal(curtain) {
		event.stopPropagation();

		$$('.curtain').style.display = 'none';

		if ('localStorage' in w) {
			var matrix = localStorage.getItem('matrix');
			try {
				matrix = JSON.parse(atob(matrix));
				populateTable(matrix);
				message('Success!', 'Your data table was successfully imported. You\'re welcome.', 'success');
				return matrix;
			} catch (e) {
				message('Error!', e.message, 'error');
				return false;
			}
		} else {
			message('Error!', 'Local Storage not supported by your browser. Please upgrade to a modern browser.', 'error');
			return false;
		}
	}

	function importData () {
		$$('#toggleMenu').checked = null;
		$$('.curtain').style.display = 'block';
	}
	
	function saveData (matrix) {
		var mtx = trimMatrix(matrix);
		$$('#toggleMenu').checked = null;
		if ('localStorage' in w) {
			localStorage.setItem('matrix', btoa(JSON.stringify(mtx)));
			message('Success!', 'Your data table has successfully been saved locally. You\'re welcome.', 'success');
			return true;
		} else {
			message('Error!', 'Local Storage not supported by your browser. Please upgrade to a modern browser.', 'error');
			return false;
		}
	}
	
	function updateContent (matrix, evt) {
		var cell = evt.target;
		var row = cell.dataset.row;
		var col = cell.dataset.col;
		var content = cell.textContent;

		if (content) {
			if (!matrix[row]) {
				var numCells = $$('table th', true).length;
				matrix.push(Array(numCells).fill(''));
			}
			matrix[row][col] = content;
		}

		$$('.nav__link--save').onclick = saveData.bind(this, matrix);
		$$('.nav__link--export').onclick = exportData.bind(this, matrix);
	}
	
	function selectContent (evt) {
		var cell = evt.target;
		
		if (d.body.createTextRange) {
			var r = document.body.createTextRange();
			r.moveToElementText(cell);
			r.select();
		} else if (w.getSelection) {
			var s = w.getSelection();
			var r = d.createRange();
			r.selectNodeContents(cell);
			s.removeAllRanges();
			s.addRange(r);
		}
	}
	
	function sortTableByColumn (matrix, evt) {
		var cell = evt.target.parentNode;
		var col = cell.dataset.col;
		var asc = cell.dataset.sort === 'asc' ? 1 : 0;
		var mtx = trimMatrix(matrix);
		var headerRow = mtx.shift();
		
		asc = !asc;
		
		mtx.sort(function (a, b) {
			return asc ?
				(a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) :
				(a[col] < b[col] ? 1 : a[col] > b[col] ? -1 : 0);
		});
		
		mtx.unshift(headerRow);
		
		populateTable(mtx);
		$$('table th', true)[col].dataset.sort = asc ? 'asc' : 'dsc';
	}
	
	function freezeColumns (evt) {
		evt.stopPropagation();
		
		var col = evt.target.parentNode.dataset.col;
		var rows = $$('table tr', true);
		var isFrozen = evt.target.dataset.freeze === 'true';

		rows.forEach(function (row) {
			for (var i = 0; i <= col; ++i) {
				var cell = row.querySelectorAll('th, td')[i];
				if (!isFrozen) {
					cell.className += ' freeze';
					cell.style.left = (200 * i) + 'px';
				} else {
					cell.style.left = 'initial';
					cell.className = cell.className.replace(' freeze', '');
				}
			}
		});
		if (!isFrozen) {
			evt.target.dataset.freeze = 'true';
			evt.target.style.color = '#f04';
		} else {
			evt.target.dataset.freeze = 'false';
			evt.target.style.color = 'white';
		}
	}
	
	function keyHandler (matrix, evt) {
		var cell = evt.target;
		var row = Number(cell.dataset.row);
		var col = Number(cell.dataset.col);
		var cellType = row === 0 ? 'th' : 'td';
		var key = evt.keyCode;
		var shifted = evt.shiftKey;
		var alted = evt.altKey;
		
		switch (key) {
			// tab
			case 9:
				if (!shifted) {
					var thisRow = $$('table tr', true)[row];
					var numCells = thisRow.querySelectorAll(cellType).length;

					if (col === numCells - 1) {
						evt.preventDefault();

						matrix.forEach(function (row, i) {
							if (i === 0) {
								row.push('Column ' + (col + 2));
							} else {
								row.push('');
							}
						});

						populateTable(matrix);
						thisRow = $$('table tr', true)[row];
						thisRow.querySelectorAll(cellType)[col + 1].focus();
					}
				} else if (col === 0) evt.preventDefault();
				break;
			
			// return
			case 13:
				if (!alted) {
					evt.preventDefault();
					if (!shifted) {
						var nextRow = $$('table tr', true)[row + 1];
						if (nextRow) {
							nextRow.querySelector('td:nth-of-type(' + (col + 1) + ')').focus()
						} else {
							var thisRow = $$('table tr', true)[row];
							var numCells = thisRow.querySelectorAll(cellType).length;

							matrix.push(Array(numCells).fill(''));

							populateTable(matrix);
							keyHandler(matrix, evt);
						}
					} else {
						var prevRow = $$('table tr', true)[row - 1];
						if (prevRow) {
							prevRow.querySelector((row - 1 === 0 ? 'th' : 'td') + ':nth-of-type(' + (col + 1) + ')').focus();
						}
					}
				}
				break;
				
			// left
			case 37:
				if (alted) {
					evt.preventDefault();
					if (col > 0) {
						$$('table tr', true)[row].querySelectorAll(row === 0 ? 'th' : 'td')[(col - 1)].focus();
					}
				}
				break;
				
			// up
			case 38:
				if (alted) {
					evt.preventDefault();
					if (row > 0) {
						$$('table tr', true)[row - 1].querySelectorAll((row - 1 === 0 ? 'th' : 'td'))[col].focus();
					}
				}
				break;
				
			// right
			case 39:
				if (alted) {
					evt.preventDefault();
					var thisRow = $$('table tr', true)[row];
					var numCells = thisRow.querySelectorAll(row === 0 ? 'th' : 'td').length;
					if (col < numCells - 1) {
						thisRow.querySelectorAll(row === 0 ? 'th' : 'td')[(col + 1)].focus();
					}
				}
				break;
				
			// down
			case 40:
				if (alted) {
					evt.preventDefault();
					var numRows = $$('table tr', true).length;
					if (row < numRows - 1) {
						$$('table tr', true)[row + 1].querySelectorAll('td')[col].focus();
					}
				}
				break;
		}
	}
	
	function populateTable (matrix) {
		var headerRow = matrix[0];
		var contentRows = matrix.slice(1);
		
		while (contentRows.length < 10) {
			contentRows.push(Array(headerRow.length).fill(''));
		}
		
		$$('thead').innerHTML = '<tr></tr>';
		
		headerRow.forEach(function (header, i) {
			var th = document.createElement('th');
			th.dataset.row = 0;
			th.dataset.col = i;
			th.innerHTML = '<span class="sort"></span>' + header + '<span class="freezer"></span>';
			th.setAttribute('contenteditable', 'true');
			th.querySelector('.sort').addEventListener('click', sortTableByColumn.bind(this, matrix));			
			th.querySelector('.freezer').addEventListener('click', freezeColumns);			
			th.addEventListener('focus', selectContent);
			th.addEventListener('blur', updateContent.bind(this, matrix));
			$$('thead tr').appendChild(th);
		});
		
		$$('tbody').innerHTML = '';
		contentRows.forEach(function (row, i) {
			var tr = document.createElement('tr');
			row.forEach(function (cell, j) {
				var td = document.createElement('td');
				td.dataset.row = (i + 1);
				td.dataset.col = j;
				td.innerHTML = cell;
				td.setAttribute('contenteditable', 'true');
				td.addEventListener('focus', selectContent);
				td.addEventListener('blur', updateContent.bind(this, matrix));
				tr.appendChild(td);
			});
			$$('tbody').appendChild(tr);
		});
		
		$$('table').onkeydown = keyHandler.bind(this, matrix);
		$$('.nav__link--save').onclick = saveData.bind(this, matrix);
		$$('.nav__link--export').onclick = exportData.bind(this, matrix);
	}
	
	function generateDefaultMatrix () {
		var headerRow = Array(5).fill('Column ').map(function (x, i) { return x + (i + 1); });
		var matrix = Array(10).fill().map(function () { return Array(5).fill(''); });
		matrix.unshift(headerRow);
		populateTable(matrix);
		if (event) $$('#toggleMenu').checked = null;
	}

	function onResize () {
		d.body.style.setProperty('--vh', (w.innerHeight / 100) + 'px');
	}

	function eventListeners () {
		w.addEventListener('resize', onResize);

		$$('.nav__link--import').addEventListener('click', importData);
		$$('.nav__link--clear').addEventListener('click', generateDefaultMatrix);
		$$('.nav__link--darkmode').addEventListener('click', toggleDarkMode);

		$$('.btn--importFromLocal').addEventListener('click', importFromLocal)
		$$('.input--importFromFile').addEventListener('change', importFromFile);
		$$('.curtain').addEventListener('click', function () { $$('.curtain').style.display = 'none'; });
	}
	
	function readLS () {
		if ('localStorage' in w) {
			var theme = w.localStorage.getItem('theme');
			if (theme) $$('body').dataset.theme = theme;
		}
	}

	function init () {
		readLS();
		eventListeners();
		onResize();
		generateDefaultMatrix();
	}

	if (document.readyState === 'complete') {
		init();
	} else {
		d.addEventListener('DOMContentLoaded', init);
	}
})(window, document);