var Modal = function (options) {
  var overlay = document.createElement('div'),
      modal = document.createElement('div'),
      message = document.createElement('span');
      
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.left = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  
  modal.style.position = 'absolute';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.webkitTransform = 'translate3d(-50%, -50%, 0)';
  modal.style.transform = 'translate3d(-50%, -50%, 0)';
  modal.style.padding = '30px';
  modal.style.backgroundColor = '#fff';
  
  message.style.display = 'block';
  message.style.marginBottom = '16px';
  message.innerHTML = options.message;
  
  modal.appendChild(message);
  overlay.appendChild(modal);
  
  switch (options.type) {
    case 'confirm':
      for (var i = 0; i < options.options.length; i++) {
        (function () {
          var button = document.createElement('button'),
              callback = options.options[i].callback || null,
              params = options.options[i].callbackParams || [];
              
          if (typeof params == 'string') {
            var parameter = params;
            params = [];
            params.push(parameter);
          }
              
          button.innerHTML = options.options[i].text;
          
          button.addEventListener('click', function () {
            if (callback) {
              callback(params);
            }
            
            document.body.removeChild(overlay);
          });
          
          modal.appendChild(button);
        })();
      }
    break;
    
    case 'prompt':
      var input = document.createElement('input');
      input.style.display = 'block';
      input.style.marginBottom = '16px';
      input.setAttribute('type', 'text');
      
      modal.appendChild(input);
      
      for (var i = 0; i < options.options.length; i++) {
        (function () {
          var button = document.createElement('button'),
              callback = options.options[i].callback || null,
              params = options.options[i].callbackParams || [];
              
          if (typeof params == 'string') {
            var parameter = params;
            params = [];
            params.push(parameter);
          }
              
          button.innerHTML = options.options[i].text;
          
          button.addEventListener('click', function () {
            params.unshift(input.value);
            if (callback) {
              callback(params);
            }
            
            document.body.removeChild(overlay);
          });
          
          modal.appendChild(button);
        })();
      }
    break;
    
    default:
    break;
  }
  
  document.body.appendChild(overlay);
};