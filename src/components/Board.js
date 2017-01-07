import React, {PropTypes} from 'react';

import {keyframes, merge, style} from 'glamor';

import Cell from './Cell';
import Info from './Info';
import Piece from './Piece';
import {E, W, toArray} from '../oth';

const boardContainer = style({
  display: 'flex',
  flexDirection: 'row',
  background: 'linear-gradient(60deg, #43A047, #26A69A)',
  backgroundSize: '400% 400%',
  animation: `${keyframes({
    '0%': {backgroundPosition: '0% 65%'},
    '50%': {backgroundPosition: '100% 36%'},
    '100%': {backgroundPosition: '0% 65%'},
  })} 30s ease infinite`,
});

const boardGrid = style({
  display: 'grid',
  gridAutoRows: '10.25vmin', // 2*(8+1)+10.25*8=100
  gridAutoColumns: '10.25vmin',
  gridGap: '2vmin',
  padding: '2vmin',
});

const disabledBoardGrid = merge(boardGrid, {
  pointerEvents: 'none',
});

const Board = ({board, clickables, enabled, onClickVaildCell}) =>
  <div {...boardContainer}>
    <div {...enabled ? boardGrid : disabledBoardGrid}>
      {toArray(board).map((piece, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;
        return (
          <Cell
            onClick={
              clickables.some(i => row === i.row && column === i.column) ?
                onClickVaildCell :
                undefined
            }
            row={row}
            column={column}
            key={`${row},${column}`}
          >
            {piece !== E ? <Piece flip={piece === W} /> : undefined}
          </Cell>
        );
      })}
    </div>
    <Info board={board} />
  </div>;

Board.propTypes = {
  board: PropTypes.any.isRequired,
  enabled: PropTypes.bool.isRequired,
  clickables: PropTypes.array.isRequired,
  onClickVaildCell: PropTypes.func,
};

export default Board;
