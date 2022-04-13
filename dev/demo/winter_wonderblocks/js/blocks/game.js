import * as shapes from './shapes.js';


class Blocks {
  updateView () {
    this.target.innerHTML = `
      <table class="blocks_${this.id}">
      ${this.board.map((row, y) => `
        <tr>
        ${row.map((cell, x) => `
          <td style="background-color: ${cell || this.board[y][x] || 'transparent'}"></td>
        `).join('')}
        </tr>
      `).join('')}
      </table>
    `; 
  }
  
  controls (evt) {
    const _this = this;
    const { active } = this;
    const stormtrooper = this.board.map(row => row.map(x => x));
    
    if (!active) return;
    
    function clearActiveFromBoard (board) {
      active.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          const value = active.shape[y][x] ? 0 : board[active.y + y][active.x + x] || 0;
          board[active.y + y][active.x + x] = value;
        });
      });
    }
    
    function canMove (board) {
      return active.shape.reduce((result, row, y) => {
        const { shape } = active;
        if (!result) return result;
        row.forEach((cell, x) => {
          const cellHasValue = !!cell;
          const boardHasValue = board[active.y + y] && board[active.y + y][active.x + x];
          if (cellHasValue && boardHasValue) result = false;
        });
        return result;
      }, true);
    }
    
    clearActiveFromBoard(stormtrooper);
    
    switch (evt.keyCode) {
      case 37:
        if (!active) break;
        if (active.x === 0) break;
        
        --active.x;
        
        if (canMove(stormtrooper)) {
          this.board = stormtrooper;
          active.updatePlacement({ x: -1 });
          this.updateView();
        } else {
          ++active.x;
        }
      break;
        
      case 39:
        if (!active) break;
        if (active.x === this.size - active.width ) break;
        
        ++active.x;
        
        if (canMove(stormtrooper)) {
          this.board = stormtrooper;
          active.updatePlacement({ x: 1 });
          this.updateView();
        } else {
          --active.x;
        }
      break;
        
      case 40:
        if (active.y + active.height === this.size) break;
      
        ++active.y;
        
        if (active.canContinue()) {
          this.board = stormtrooper;
          active.updatePlacement();
          this.updateView();
        } else {
          --active.y;
        }
      break;
        
      case 16:
        if (!active) return false;
        
        const currentShape = [ ...active.shape ];
        const {
          x: currentX,
          width: currentWidth,
          height: currentHeight
        } = active;
        const shape = [];
        
        for (let i = active.shape[0].length - 1; i >= 0; i--) {
          const row = [];
          for (let j = 0; j < active.shape.length; j++) {
            row.push(active.shape[j][i]);
          }
          shape.push(row);
        }
        
        active.shape = shape;
        active.height = shape.length;
        active.width = shape[0].length;
        if (active.x + active.width > this.size - 1) --active.x;
        
        if (canMove(stormtrooper)) {
          this.board = stormtrooper;
          active.updatePlacement();
          this.updateView();
        } else {
          active.shape = currentShape;
          active.x = currentX;
          active.width = currentWidth;
          active.height = currentHeight;
        }
      break;
    }
  }
  
  gameOver () {
    this.stop();
    this.fireEvent('gameover');
  }
  
  checkForGameOver () {
    const gameover = !!this.board[0].filter(cell => !!cell).length;
    return true;
  }
  
  checkForCompleteRow () {
    this.board.forEach((row, y) => {
      const isFull = !row.filter(x => !x).length;
      if (isFull) {
        const chunkToMoveDown = this.board.splice(0, y + 1);
        chunkToMoveDown.pop();
        this.board.unshift(Array(this.size).fill(0), ...chunkToMoveDown);
        this.updateView();
        this.fireEvent('rowcleared');
      }
    });
  }
  
  advanceActivePiece () {
    ++this.active.y;
    this.active.updatePlacement();
    this.updateView();
  }
  
  generatePiece () {
    const rand = Math.floor(Math.random() * this.shapes.length);
    const shape = this.shapes[rand];
    this.active = new shape(this);
    this.fireEvent('newpiece');
    
    if (this.active.pieceIsBelow()) this.gameOver();
  }
  
  gameplay () {
    if (this.active && this.active.canContinue()) {
      this.advanceActivePiece();
    } else {
      this.active = null;
      this.checkForCompleteRow();
      this.generatePiece();
      this.updateView();
    }
  }
  
  stop () {
    clearInterval(this.playInterval);
    this.playing = false;
    this.fireEvent('pause');
  }
  
  start () {
    this.playInterval = setInterval(this.gameplay.bind(this), this.speed);
    this.playing = true;
    this.fireEvent('play');
  }
  
  initBoard () {
    return Array(this.size).fill('').map(x => {
      return Array(this.size).fill(0);
    });
  }
  
  stylize () {
    const style = document.createElement('style');
    const { height } = this.target.getBoundingClientRect();
    
    style.innerHTML = `
      .blocks_${this.id} {
        table-layout: fixed;
        width: 100%;
        height: 100%;
        border-spacing: 0;
      }
      
      .blocks_${this.id} td {
        height: ${height / this.size}px
      }
    `;
    
    this.target.parentNode.appendChild(style);
  }
  
  namespace (...args) {
    return [ this.name, ...args ].join('.');
  }
  
  fireEvent (...args) {
    this.events.dispatchEvent(new CustomEvent(this.namespace(...args)));
  }
  
  eventListeners () {
    addEventListener('keyup', this.controls.bind(this));
    addEventListener('resize', this.stylize.bind(this));
  }
  
  constructor (target, options = {}) {
    this.target = target;
    this.size = options.size || 12;
    this.speed = options.speed || 1000;
    this.colors = options.colors || [ '#f04', '#0f8', '#08f', '#80f' ];
    this.name = options.name || 'blocks';
    this.events = document.createElement('div');
    this.board = this.initBoard();
    this.pieces = [];
    this.shapes = [];
    this.id = Math.random().toString(16).slice(2);
    for (const shape in shapes) this.shapes.push(shapes[shape]);
    
    this.updateView();
    this.stylize();
    this.eventListeners();
    this.start();
  }
}

export default Blocks;