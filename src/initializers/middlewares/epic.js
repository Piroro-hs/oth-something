import {combineEpics, createEpicMiddleware} from 'redux-observable';

import {computeMoveEpic, computeMoveWithInputEpic, gameStartEpic, nextTurnEpic} from '../../modules/game';
import {updatePlayersEpic} from '../../modules/players';

const epicMiddleware = createEpicMiddleware(combineEpics(
  computeMoveEpic,
  computeMoveWithInputEpic,
  gameStartEpic,
  nextTurnEpic,
  updatePlayersEpic,
));

export default epicMiddleware;
