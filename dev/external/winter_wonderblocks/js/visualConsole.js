(function () {
  const output = document.createElement('div');
  const btnClear = document.createElement('button');
  const _log = console.log;
  const _error = window.onerror;
  
  Object.assign(output.style, {
    position: 'fixed',
    top: '8px',
    left: `${innerWidth - (innerWidth / 4) - 8}px`,
    padding: '16px',
    width: '25vw',
    height: '50vh',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    opacity: '0.8',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
    overflow: 'auto',
    zIndex: '999'
  });
  
  btnClear.textContent = 'Clear';
  
  output.appendChild(btnClear);
  document.body.appendChild(output);
  
  output.dragEnd = (isMobile, dragBind) => {
    const moveEvent = isMobile ? 'touchmove' : 'mousemove';
    removeEventListener(moveEvent, dragBind);
    
    output.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.5)';
  
    output.addEventListener('mousedown', output.initDrag);
    output.addEventListener('touchstart', output.initDrag);
  };
  
  output.drag = (isMobile, evt) => {
    const x = isMobile ? event.changedTouches[0].clientX : event.clientX;
    const y = isMobile ? event.changedTouches[0].clientY : event.clientY;
    const { layerX, layerY } = evt
    
    Object.assign(output.style, {
      top: `${y - layerY}px`,
      left: `${x - layerX}px`
    });
  };
  
  output.dragStart = (isMobile, evt) => {
    const moveEvent = isMobile ? 'touchmove' : 'mousemove';
    const endEvent = isMobile ? 'touchend' : 'mouseup';
    const dragBind = output.drag.bind(null, isMobile, evt);
    const dragEndBind = output.dragEnd.bind(null, isMobile, dragBind);
    
    output.style.boxShadow = '0px 0px 8px rgba(128, 0, 255, 0.5)';
    
    addEventListener(moveEvent, dragBind);
    addEventListener(endEvent, dragEndBind);
  };
  
  output.initDrag = () => {
    const isMobile = event.type === 'touchstart';
    const endEvent = isMobile ? 'touchend' : 'mouseup';
    const to = setTimeout(output.dragStart.bind(null, isMobile, event), 500);
    
    output.addEventListener(endEvent, () => clearTimeout(to));
    output.removeEventListener('mousedown', output.initDrag);
    output.removeEventListener('touchstart', output.initDrag);
  };
  
  output.addEventListener('mousedown', output.initDrag);
  output.addEventListener('touchstart', output.initDrag);
  
  btnClear.addEventListener('click', () => {
    output.innerHTML = '';
    output.appendChild(btnClear);
  });
  
  window.onerror = (...args) => {
    const div = document.createElement('div');
    const [
      message,
      source,
      lineno,
      colno,
      error
    ] = args;
    
    div.style.color = 'crimson';
    div.style.pointerEvents = 'none';
    div.innerHTML += `Error: ${source.split('/').pop()} @ ${lineno}: ${message}`;
    output.appendChild(div);
    output.scrollTo(0, output.scrollHeight);
    
    _error.call(null, args);
  };
  
  console.log = (...args) => {
    const div = document.createElement('div');
    const result = [];
    let label = '';
    
    try {
      const err = new Error('dummy');
      const stackLines = err.stack && err.stack.split('\n');
      const origin = stackLines[1];
      const fn = origin.indexOf('@') > -1 ? origin.split('@')[0] : 'anonymous';
      const slashSplit = origin.split('/');
      const fileName = slashSplit.pop();
      
      label = `${fn} ${fileName}`;
    } catch (e) { }
    
    div.style.pointerEvents = 'none';
    
    for (const arg of args) {
      result.push(typeof arg === 'object' ? JSON.stringify(arg) : arg);
    }
    
    div.innerHTML += `${label}: ${result.join(' ')}`;
    
    output.appendChild(div);
    
    output.scrollTo(0, output.scrollHeight);
    
    _log(args);
  };
})();