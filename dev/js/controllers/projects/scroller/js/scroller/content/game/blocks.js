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
    
    if (!this.active || !this.active.canContinue()) return;
    
    function clearCurrent () {
      _this.active.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          _this.board[_this.active.y - 1 + y][_this.active.x + x] = 0;  
        });
      });
    }
    
    this.stop();
    clearCurrent();
    
    switch (evt.keyCode) {
      case 37:
        if (!this.active) break;
        if (this.active.x === 0) break;
        
        --this.active.x;
        if (this.active.canContinue()) this.active.updatePlacement();
        else ++this.active.x;
        break;
        
      case 39:
        if (!this.active) break;
        if (this.active.x === this.size - this.active.width ) break;
        
        ++this.active.x;
        if (this.active.canContinue()) this.active.updatePlacement();
        else --this.active.x;
        break;
        
      case 40:
        if (this.active.y + this.active.height === this.size) break;
      
        ++this.active.y;
        if (this.active.canContinue()) this.active.updatePlacement();
        else --this.active.y;
        break;
        
      case 16:
        if (!this.active) return false;
        
        const currentShape = [ ...this.active.shape ];
        const currentX = this.active.x;
        const shape = [];
        for (let i = this.active.shape[0].length - 1; i >= 0; i--) {
          const row = [];
          for (let j = 0; j < this.active.shape.length; j++) {
            row.push(this.active.shape[j][i]);
          }
          shape.push(row);
        }
        
        this.active.shape = shape;
        this.active.height = shape.length;
        this.active.width = shape[0].length;
        if (this.active.x + this.active.width > this.size - 1) --this.active.x;
        
        if (this.active.canContinue()) this.active.updatePlacement();
        else {
          this.active.shape = currentShape;
          this.active.x = currentX;
        }
    }
    
    this.start();
  }
  
  checkForCompleteRow () {
    this.board.forEach((row, y) => {
      const isFull = !row.filter(x => !x).length;
      if (isFull) {
        const chunkToMoveDown = this.board.splice(0, y + 1);
        chunkToMoveDown.pop();
        this.board.unshift(Array(this.size).fill(0), ...chunkToMoveDown);
        this.updateView();
      }
    })
  }
  
  advanceActivePiece () {
    this.active.updatePlacement();
    this.updateView();
  }
  
  generatePiece () {
    const rand = Math.floor(Math.random() * this.shapes.length);
    const shape = this.shapes[rand];
    this.active = new shape(this);
  }
  
  stop () {
    clearInterval(this.playInterval);
    this.playing = false;
  }
  
  start () {
    this.playInterval = setInterval((_this) => {
      if (!_this.active) _this.generatePiece();
      else _this.advanceActivePiece();
    }, this.speed, this);
    this.playing = true;
  }
  
  gameOver () {
    this.stop();
    console.log('game over');
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
    
    document.head.appendChild(style);
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
    this.board = this.initBoard();
    this.pieces = [];
    this.shapes = [
      ShapeL,
      ShapeT,
      ShapeI,
      ShapeZ,
      ShapeS,
      ShapeBox
    ];
    this.id = Math.random().toString(16).slice(2);
    
    this.updateView();
    this.stylize();
    this.eventListeners();
    this.start();
  }
}

class Piece {
  isAtBottom () {
    return this.y + this.height - 1 === this.game.size;
  }
  
  pieceIsBelow () {
    const hasCollisions = this.shape.reduce((result, row, y) => {
      if (result) return result;
      row.forEach((cell, x) => {
        const cellHasValue = !!cell;
        const nextRowInShapeHasValue = !!this.shape[y + 1] ? !!this.shape[y + 1][x] : false;
        const nextRowOnBoardHasValue = !!this.game.board[this.y + y][this.x + x];
        if (cellHasValue && nextRowOnBoardHasValue && !nextRowInShapeHasValue) result = true;
      });
      return result;
    }, false);
    
    return hasCollisions;
  }
  
  canContinue (specificScenario) {
    const _this = this;
    const enders = ['isAtBottom', 'pieceIsBelow'];
    if (!specificScenario) {
      const len = enders.length;
      let i = 0;
      let ender;
      
      for (; (ender = enders[i]) && i < len; ++i) {
        if (this[ender]()) return false;
      }
      
      return true;
    } else {
      const scenario = this[specificScenario];
      return (scenario && !scenario.call(this)) || false;
    }
  }
  
  updatePlacement () {
    if (!this.canContinue()) {
      this.game.checkForCompleteRow()
      this.game.active = false;
    } else {
      this.y - 1 >= 0 && this.game.board[this.y - 1].splice(this.x, this.width, ...Array(this.width).fill(0));
      this.shape.forEach((row, y) => {
        const values = row.map((cell, x) => {
          const thisShapeHasValue = !!cell;
          const clearCell = y !== this.shape.length - 1 && !cell;
          const boardCellValue = this.game.board[this.y + y][this.x + x];
          return thisShapeHasValue ? this.color : clearCell ? 0 : boardCellValue || 0;
        });
        this.game.board[this.y + y].splice(this.x, row.length, ...values);
      });
      
      this.game.updateView();
      
      ++this.y;
      
      this.y === 1 && !this.canContinue() && this.game.gameOver();
    }
  }
  
  initOnBoard () {
    this.width = this.shape[0].length;
    this.height = this.shape.length;
    this.x = Math.floor(Math.random() * (this.game.size - this.width));
    this.y = 0;
    
    this.updatePlacement();
  }
  
  constructor (game) {
    const colors = game.colors;
      
    this.game = game;
    this.element = document.createElement('div');
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
}

class ShapeL extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 0, 1 ],
      [ 0, 1 ],
      [ 1, 1 ],
    ];
    this.initOnBoard();
  }
}

class ShapeT extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1, 1],
      [ 0, 1, 0 ]
    ];
    this.initOnBoard();
  }
}

class ShapeZ extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1, 0],
      [ 0, 1, 1 ]
    ];
    this.initOnBoard();
  }
}

class ShapeS extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 0, 1, 1],
      [ 1, 1, 0 ]
    ];
    this.initOnBoard();
  }
}

class ShapeI extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1 ],
      [ 1 ],
      [ 1 ],
      [ 1 ]
    ];
    this.initOnBoard();
  }
}

class ShapeBox extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1],
      [ 1, 1 ]
    ];
    this.initOnBoard();
  }
}

win.Blocks = Blocks;