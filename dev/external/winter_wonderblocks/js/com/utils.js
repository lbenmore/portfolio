export function ajax (options) {
  const {
    type = 'ajax',
    method = 'GET',
    url = './',
    async = true,
    params = null,
    headers = null,
    callback = (function () {}),
    success = (function () {}),
    error = (function () {}),
    final = (function () {})
  } = options;
  const xhr = new XMLHttpRequest;
  const fd = new FormData();

  for (const _ in params) fd.append(_, params[_]);

  xhr.onload = function () {
    let data;
    
    switch (type) {
      case 'json':
        try {
          data = JSON.parse(xhr.responseText);
        } catch (err) {
          console.error(err);
          err.call(xhr);
          return final();
        }
        break;

      case 'xhr':
        data = xhr.responseXML;
        break;

      default:
        data = xhr.responseText;
    }

    success.call(xhr, data);
    callback.call(xhr, data);
    final();
  };

  xhr.onerror = function () {
    error.call(xhr);
    callback.call(xhr);
    final();
  };

  xhr.open(method, url, async);
  for (const _ in headers) xhr.setRequestHeader(_, headers[_]);
  params ? xhr.send(fd) : xhr.send();
}

export function isTouchDevice () {
  return !!('ontouchstart' in window);
}

export function log (...args) {
  const stl = 'padding:2px 4px;background:blueviolet;color:springgreen;border-radius:4px';
  let label = 'LOG: ';

  try {
    const err = new Error();
    const lines = err.stack.split('\n');
    const originLine = lines[2];
    const bitsSlash = originLine.split('/');
    const fNameAndLoc = bitsSlash.pop();
    const bitsColon = fNameAndLoc.split(':');
    const charNo = bitsColon.pop();
    const lineNo = bitsColon.pop();
    
    label += `${bitsColon}@(${lineNo}:${charNo}) -> `;
  } catch (err) {

  }

  console.log.apply(console, ['%c%s', stl, label, ...args])
}