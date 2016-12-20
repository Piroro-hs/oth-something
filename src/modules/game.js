import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';
import {Observable} from 'rxjs/Observable';

import {B, init, opp, place, placeables} from '../oth';

const START_GAME = 'oth-something/game/START_GAME';
const START_TURN = 'oth-something/game/START_TURN';
const INPUT = 'oth-something/game/INPUT';
const MOVE = 'oth-something/game/MOVE';

const initialState = {
  history: [{board: init(), turn: B}],
  play: false,
};

const reducers = {
  [START_GAME]() {
    return {...initialState, play: true};
  },
  [MOVE]({history}, {payload}) {
    const [{board, turn}] = history;
    const nextBoard = place(board, payload, turn);
    const nextTurn = opp(turn);
    const passNext = placeables(nextBoard, nextTurn).length === 0;
    return {
      play: !passNext || placeables(nextBoard, turn).length > 0,
      history: [{board: nextBoard, turn: !passNext ? nextTurn : turn}, ...history],
    };
  },
};

export default function reducer(state = initialState, action) {
  // return (reducers[action.type] || id)(state, action);
  return reducers[action.type] ? reducers[action.type](state, action) : state;
}

export function startGame() {
  return {type: START_GAME};
}

export function startTurn() {
  return {type: START_TURN};
}

export function input(payload) {
  return {type: INPUT, payload};
}

export function move(payload) {
  return {type: MOVE, payload};
}

export function gameStartEpic(action$) {
  return action$
    .ofType(START_GAME)
    .map(startTurn);
}

export function computeMoveEpic(action$, store) {
  return action$
    .ofType(START_TURN)
    .filter(() => {
      const {config: {player}, game: {history: [{turn}]}, players} = store.getState();
      return !players[player[turn]].interactive;
    })
    .concatMap(() => {
      const {config: {computeWait, player}, game: {history}, players} = store.getState();
      const [{turn}] = history;
      const move$ = Observable.fromPromise(players[player[turn]].compute({history}));
      return Observable.merge(move$, Observable.timer(computeWait))
        .withLatestFrom(move$, (_, v) => v)
        .last()
        .takeUntil(action$.ofType(START_GAME));
    })
    .map(move);
}

export function computeMoveWithInputEpic(action$, store) {
  return action$
    .ofType(INPUT)
    .concatMap(({payload}) => {
      const {config: {player}, game: {history}, players} = store.getState();
      const [{turn}] = history;
      return Observable.fromPromise(players[player[turn]].compute({history}, payload))
        .takeUntil(action$.ofType(START_GAME));
    })
    .map(move);
}

export function nextTurnEpic(action$, store) {
  return action$
    .ofType(MOVE)
    .filter(() => store.getState().game.play)
    .map(startTurn);
}
