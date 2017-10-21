let
table = {},
numRows,
numCols,
row,
col,
menuOptions = $$('.menu__option');

toggleContextMenu = (e) => {
  switch (e.type) {
    case 'contextmenu':
      e.preventDefault();
      $$('.menu').classList.add('show');
      $$('.menu').style.top = `${e.pageY}px`;
      $$('.menu').style.left = `${e.pageX}px`;
    break;

    case 'click':
      $$('.menu').classList.remove('show');
      if (e.target.classList.contains('menu__option') && !e.target.classList.contains('menu__action')) {
        for (let menuOption of menuOptions) {
          menuOption.classList.remove('active');
        }
        e.target.classList.add('active');
      }
    break;
  }
};

setKeyBindings = () => {
  addEventListener('keydown', (e) => {
    if (e.target.classList.contains('cell')) {
      let
      newRow = parseInt(e.target.getAttribute('data-row').split('-')[1]),
      newCol = parseInt(e.target.getAttribute('data-col').split('-')[1]),
      newCell;

      switch (e.keyCode) {
        case 9:
          e.preventDefault();
          newCol = e.shiftKey ? --newCol : ++newCol;
          if (newCol == col) addColumn();
        break;

        case 13:
          e.preventDefault();
          newRow = e.shiftKey ? --newRow : ++newRow;
          if (newRow == row) addRow();
        break;

        case 37:
          --newCol;
        break;

        case 38:
          --newRow;
        break;

        case 39:
          ++newCol;
        break;

        case 40:
          ++newRow;
        break;

        default:
        break;
      }

      newCell = $$(`div[data-row=row-${newRow}][data-col=col-${newCol}]`);
      if (newCell) if (newCell.focus) newCell.focus();
    }
  })
};

ls = (type, key, value) => {
  if (window.localStorage) {
    switch (type) {
      case 'set':
        localStorage.setItem(key, value);
        return true;
      break;

      case 'get':
        if (localStorage.getItem(key) &&
          localStorage.getItem(key) != 'undefined') {
          return localStorage.getItem(key);
        } else {
          return false;
        }
      break;

      case 'clear':
        localStorage.clear();
        populateTable();
      break;
    }
  } else {
    $$.log('Local storage not supported.', 'error');
    return false;
  }
};

class Cell {
  constructor(target, currRow, currCol) {
    let cell = document.createElement('div');
    cell.classList.add('cell');

    cell.setAttribute('contenteditable', 'true');
    cell.setAttribute('data-row', `row-${currRow}`);
    cell.setAttribute('data-col', `col-${currCol}`);

    if (currRow == 0) {
      cell.classList.add('header');
      cell.textContent = table.headers[currCol];
    } else {
      if (table.data[currRow]) {
        if (table.data[currRow][table.headers[currCol]]) {
          cell.textContent = table.data[currRow][table.headers[currCol]];
        }
      }
    }

    cell.addEventListener('blur', this.saveData.bind(null, cell));
    cell.addEventListener('focus', this.selectCell.bind(null, cell));

    target.appendChild(cell);
  };

  selectCell(cell) {
    let range = document.createRange();
    range.selectNodeContents(cell);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }

  saveData(cell) {
    let
    currRow = parseInt(cell.getAttribute('data-row').split('-')[1]),
    currCol = parseInt(cell.getAttribute('data-col').split('-')[1]),
    newHeader = cell.textContent;

    if (currRow == 0) {
      if (table.headers[currCol] != newHeader) {
        let thisCol = table.headers[currCol];
        for (let cellData of table.data) {
          cellData[newHeader] = cellData[thisCol];
          delete cellData[thisCol];
        }

        table.headers[currCol] = newHeader;
        ls('set', 'table', JSON.stringify(table));
      }
    } else {
      table.data[currRow][table.headers[currCol]] = newHeader;
    }

    ls('set', 'table', JSON.stringify(table));

    $$.log('table data saved');
    $$.log(table.data, 'dir');
  };
};

class Row {
  constructor(target, currRow) {
    let
      newRow = document.createElement('div'),
      setData = {};

    newRow.classList.add('row');
    target.appendChild(newRow);

    if (!table.data[currRow]) {
      for (let header of table.headers) {
        setData[header] = "";
      }

      table.data.push(setData);
    }

    this.setCells(newRow, currRow);
  };

  setCells(target, currRow) {
    col = 0;
    while (col < numCols) {
      new Cell(target, currRow, col);
      ++col;
    }
  };
};

addColumn = () => {
  let rowElements = $$('.row');

  table.headers.push(`column_${col + 1}`);
  numCols = table.headers.length;

  row = 0;

  for (let rowElement of rowElements) {
    new Cell(rowElement, row, col);
    ++row;
  }

  for (let rowData of table.data) {
    rowData[`column_${col + 1}`] = '';
  }

  ++col;

  ls('set', 'table', JSON.stringify(table));

  $$.log('new column added');
};

addRow = () => {
  new Row($$('.table'), row);
  ++row;

  ls('set', 'table', JSON.stringify(table));

  $$.log('new row added');
};

populateTable = () => {
  $$('.table').innerHTML = '';

  table.data = ls('get', 'table') ? JSON.parse(ls('get', 'table')).data : [];
  table.headers = ls('get', 'table') ? JSON.parse(ls('get', 'table')).headers : ['uid', 'label', 'group'];

  row = 0;
  col = 0;

  numCols = table.headers.length;
  numRows = Math.max(table.data.length, 11);

  while (row < numRows) {
    new Row($$('.table'), row);
    ++row;
  }

  $$.log('table initialized');
};

importData = (e) => {
  if (e.target.files) {
    if (e.target.files[0]) {
      let
      file = e.target.files[0],
      importParams = new FormData();

      importParams.append('action', 'import_data');
      importParams.append('file', file);

      $$.ajax({
        type: 'json',
        method: 'POST',
        url: './com/utilities.php',
        params: importParams
      }, (response) => {
        let
        data = JSON.parse(response.data),
        headers = JSON.parse(response.headers),
        headerRow = {};

        $$('#menu__action--import').value = null;

        for (let header of headers) {
          headerRow[header] = "";
        }

        data.unshift(headerRow);

        table.data = data;
        table.headers = headers;

        ls('set', 'table', JSON.stringify(table));
        populateTable();
      });
    }
  }
}

exportData = () => {
  let
  data = table.data.slice(1, table.data.length),
  exportParams = new FormData();

  exportParams.append('action', 'export_data');
  exportParams.append('data', JSON.stringify(data));

  $$.ajax({
    type: 'json',
    method: 'POST',
    url: './com/utilities.php',
    params: exportParams
  }, (response) => { $$.log(response);
    let
    a = document.createElement('a'),
    clearParams = new FormData();

    a.setAttribute('download', response.file_name);
    a.setAttribute('href', './output/' + response.file_name);
    a.click();

    clearParams.append('action', 'clean_up');
    clearParams.append('folder_path', '../output');

    $$.ajax({
      method: 'POST',
      url: './com/utilities.php',
      params: clearParams
    });
  });
};

initFns = () => {
  for (let menuOption of menuOptions) {
    menuOption.style.setProperty('--bkg-hex', menuOption.getAttribute('data-bkg-hex'));
  }

  $$('.menu__action--addCol').on('tap', addColumn);
  $$('.menu__action--addRow').on('tap', addRow);
  $$('.menu__action--clear').on('tap', ls.bind(null, 'clear'));
  $$('.menu__action--export').on('tap', exportData);
  $$('#menu__action--import').on('change', importData);
  addEventListener('contextmenu', toggleContextMenu);
  addEventListener('click', toggleContextMenu);

  if (window.orientation != undefined) {
    let
    mobileStyles = document.createElement('link'),
    chkMenu = document.createElement('input'),
    btnMenu = document.createElement('label');

    mobileStyles.setAttribute('rel', 'stylesheet');
    mobileStyles.setAttribute('href', './styles/stylesheet.mobile.css');
    $$('head').appendChild(mobileStyles);

    chkMenu.setAttribute('type', 'checkbox');
    chkMenu.setAttribute('id', 'btn--menu');
    document.body.insertBefore(chkMenu, document.body.childNodes[0]);

    btnMenu.classList.add('btn');
    btnMenu.classList.add('btn--menu');
    btnMenu.setAttribute('for', 'btn--menu');
    btnMenu.innerHTML = '<span></span>';
    $$('body').appendChild(btnMenu);
  }

  populateTable();
  setKeyBindings();
};

document.addEventListener('DOMContentLoaded', initFns);
