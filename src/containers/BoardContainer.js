import {connect} from 'react-redux';

import Board from '../components/Board';
import {input} from '../modules/game';

function mapStateToProps({config: {player}, game: {history: [{board, turn}], play}, players}) {
  return {
    board,
    clickables: Array(64).fill()
      .map((_, index) => ({row: Math.floor(index / 8), column: index % 8}))
      .filter(index => players[player[turn]].testCellClickable(board, index, turn)),
    enabled: play,
  };
}

const BoardContainer = connect(mapStateToProps, {onClickVaildCell: input})(Board);

export default BoardContainer;
