import React, {PropTypes} from 'react';

import {merge, style} from 'glamor';

const pieceContainer = style({
  width: '100%',
  height: '100%',
  position: 'relative', // もしくはmargin
  transition: 'transform 0.5s',
  transformStyle: 'preserve-3d',
  pointerEvents: 'none',
});

const flippedPieceContainer = merge(pieceContainer, {
  transform: 'rotate3d(1, -1, 0, 180deg)',
});

const black = style({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.87)',
  backfaceVisibility: 'hidden',
});

const white = style({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 0,
  backgroundColor: 'rgba(255, 255, 255, 1.0)',
});

const Piece = ({flip}) =>
  <div {...flip ? flippedPieceContainer : pieceContainer}>
    <div {...black} />
    <div {...white} />
  </div>;

Piece.propTypes = {
  flip: PropTypes.bool,
};

export default Piece;
