import Piece from './piece.js';

export class ShapeL extends Piece {
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

export class ShapeT extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1, 1],
      [ 0, 1, 0 ]
    ];
    this.initOnBoard();
  }
}

export class ShapeZ extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1, 0],
      [ 0, 1, 1 ]
    ];
    this.initOnBoard();
  }
}

export class ShapeS extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 0, 1, 1],
      [ 1, 1, 0 ]
    ];
    this.initOnBoard();
  }
}

export class ShapeI extends Piece {
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

export class ShapeBox extends Piece {
  constructor (game) {
    super(game);
    this.shape = [
      [ 1, 1],
      [ 1, 1 ]
    ];
    this.initOnBoard();
  }
}