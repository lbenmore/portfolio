export default class Piece {
  isAtBottom () {
    return this.y + this.height === this.game.size;
  }
  
  pieceIsBelow () {
    console.log('** pieceIsBelow **');
    const hasCollisions = this.shape.reduce((result, row, y) => {
      console.log('** row start **');
      if (result) return result;
      row.forEach((cell, x) => {
        const cellHasValue = !!cell;
        const nextRowOnBoardHasValue = !!this.game.board[this.y + y + 1] && !!this.game.board[this.y + y + 1][this.x + x];
        const nextRowInShapeHasValue = !!this.shape[y + 1] ? !!this.shape[y + 1][x] : false;
        console.log(cellHasValue, nextRowOnBoardHasValue, !nextRowInShapeHasValue);
        if (cellHasValue && nextRowOnBoardHasValue && !nextRowInShapeHasValue) result = true;
      });
      console.log('** row end **', result);
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
  
  updatePlacement (adjustments) {
    this.y - 1 >= 0 && this.game.board[this.y - 1].splice(this.x, this.width, ...Array(this.width).fill(0));
    this.shape.forEach((row, y) => {
      const values = row.map((cell, x) => {
        if (adjustments) {
          adjustments.x && (x += adjustments.x);
          adjustments.y && (y += adjustments.y);
        }
        const thisCellHasValue = !!cell;
        const clearCell = !thisCellHasValue && this.shape[y + 1] && this.shape[y + 1][x];
        const boardCellValue = this.game.board[this.y + y][this.x + x];
        return thisCellHasValue ? this.color : clearCell ? 0 : boardCellValue || 0;
      });
      this.game.board[this.y + y].splice(this.x, row.length, ...values);
    });
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