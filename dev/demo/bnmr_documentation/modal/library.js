// JavaScript Document

var
$ = function (el) {
  var sel;
  el.slice(0, 1) == '#' ? sel = document.querySelector(el) : sel = document.querySelectorAll(el);
  return sel;
},

ajax = function (options, callback) {
  var xhr = new XMLHttpRequest(),
      type = options.type || 'ajax',
      method = options.method || 'GET',
      url = options.url || './',
      isAsync = options.async || true;
      
  xhr.open(method, url, isAsync);
  xhr.send();
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      switch (type) {
        case 'json':
          callback(JSON.parse(xhr.responseText));
        break;
        
        default:
          callback(xhr.responseText);
        break;
      }
    }
  };
      
},

initMenu = function () {
  for (var i = 0; i < $('.content__card').length; i++) {
    var link = document.createElement('a');
    link.className = 'sidebar__link';
    link.innerHTML = $('.content__card')[i].getAttribute('id');
    link.setAttribute('href', '#' + $('.content__card')[i].getAttribute('id'));
    $('.container__sidebar')[0].appendChild(link);
  }
},

handleFunctions = function (functions) {
  for (var i = 0; i < functions.length; i++) {
    var card = document.createElement('div');
    card.setAttribute('id', functions[i].name);
    card.className = 'content__card';
    $('.container__content')[0].appendChild(card);
    
    var title = document.createElement('div');
    title.className = 'card__title';
    title.innerHTML = functions[i].syntax;
    card.appendChild(title);
    
    var description = document.createElement('div');
    description.className = 'card__description';
    description.innerHTML = functions[i].description;
    card.appendChild(description);
    
    var parameters = document.createElement('div');
    parameters.className = 'card__parameters';
    card.appendChild(parameters);
    
      var table = document.createElement('table');
      table.className = 'parameters__table';
      parameters.appendChild(table);
      
        var row_header = document.createElement('tr');
        row_header.className = 'parameters__row';
        row_header.innerHTML = '<td class="parameters__header">Parameter</td><td class="parameters__header">Type</td><td class="parameters__header">Description</td>';
        table.appendChild(row_header);
        
        for (var j = 0; j < functions[i].parameters.length; j++) {
          var row_param = document.createElement('tr');
          row_param.className = 'parameters__row';
          table.appendChild(row_param);
          
            var param_parameter = document.createElement('td');
            if (functions[i].parameters[j].required) {
              param_parameter.className = 'parameters__cell parameters__cell--parameter parameters__cell--required';
              param_parameter.innerHTML = functions[i].parameters[j].name + '*';
            } else {
              param_parameter.className = 'parameters__cell parameters__cell--parameter';
              param_parameter.innerHTML = functions[i].parameters[j].name;
            }
            row_param.appendChild(param_parameter);
          
            var param_type = document.createElement('td');
            param_type.className = 'parameters__cell parameters__cell--type';
            param_type.innerHTML = functions[i].parameters[j].type;
            row_param.appendChild(param_type);
          
            var param_description = document.createElement('td');
            param_description.className = 'parameters__cell parameters__cell--description';
            param_description.innerHTML = functions[i].parameters[j].description;
            row_param.appendChild(param_description);
        }
        
    var example = document.createElement('div');
    example.className = 'card__example';
    example.innerHTML = 'Examples:<br><pre>' + functions[i].example + '</pre>';
    card.appendChild(example);
  }
  
  initMenu();
},

initFns = function () {
  ajax({
    'type' : 'json',
    'url' : './functions.json'
  }, handleFunctions);
};

document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    initFns();
  }
};