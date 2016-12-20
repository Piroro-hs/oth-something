import {remote} from 'electron';
import {join} from 'path';
import {readFile} from 'fs-extra';

// import chokidar from 'chokidar';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import {Observable} from 'rxjs/Observable';

import playerParser from './playerParser';

const RELOAD_PLAYERS = 'oth-something/players/RELOAD_PLAYERS';
const UPDATE_PLAYERS_LIST = 'oth-something/players/UPDATE_PLAYERS_LIST';

const initialState = {
  ...playerParser('oth-ai-default'),
};

const reducers = {
  [UPDATE_PLAYERS_LIST](state, {payload}) {
    return {
      ...payload.reduce((acc, player) => ({
        ...acc,
        ...playerParser(player),
      }), {}),
    };
  },
};

export default function reducer(state = initialState, action) {
  // return (reducers[action.type] || id)(state, action);
  return reducers[action.type] ? reducers[action.type](state, action) : state;
}

export function reloadPlayers() {
  return {type: RELOAD_PLAYERS};
}

function updatePlayersList(payload) {
  return {type: UPDATE_PLAYERS_LIST, payload};
}

export function updatePlayersEpic(action$) {
  const jsonPath = join(remote.app.getPath('userData'), 'oth-config', 'plugins', 'package.json');
  // const readJsonObservable = Observable.bindNodeCallback(readJson); // It's broken.
  const readJsonObservable = Observable.bindNodeCallback(readFile, JSON.parse);
  return Observable.merge(
    action$.ofType(RELOAD_PLAYERS),
    // Observable.fromEvent(chokidar.watch(jsonPath), 'ready'),
    // Observable.fromEvent(chokidar.watch(jsonPath), 'change'),
    Observable.timer(500),
  )
    .concatMap(() => readJsonObservable(jsonPath))
    .map(({dependencies}) => Object.keys(dependencies).filter(k => k.startsWith('oth-ai-')))
    .map(updatePlayersList);
}
