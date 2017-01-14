import {createInterface, clearScreenDown, cursorTo} from 'readline';

import {combineReducers, createStore} from 'redux';
import {buildStack} from 'redux-stack';

import stack from './initializers';
import {updateConfig} from './modules/config';
import {input, startGame} from './modules/game';
import {B, W, count, toArray} from './oth';

function init() {
  process.stdout.setDefaultEncoding('utf8');
  const initialState = {};
  const {reducers, enhancer} = buildStack(stack);
  const store = createStore(combineReducers(reducers), initialState, enhancer);
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return {store, rl};
}

function render(store) {
  cursorTo(process.stdout, 0, 0);
  clearScreenDown(process.stdout);
  const {config: {player}, game: {history: [{board, turn}]}, players} = store.getState();
  process.stdout.write(`${turn === B ? '〇 black    white' : '   black    white ●'}\n`);
  process.stdout.write(
    `    ${`0${count(board, B)}`.slice(-2)}        ${`0${count(board, W)}`.slice(-2)}\n\n`,
  );
  process.stdout.write('  a b c d e f g h\n');
  process.stdout.write(`${
    toArray(board)
      .map((piece, i) => {
        const index = {row: Math.floor(i / 8), column: i % 8};
        return players[player[turn]].testCellClickable(board, index, turn) ?
          '・' :
          piece === B ? '〇' : piece === W ? '●' : '　';
      })
      .join('')
      .replace(
        /(.{8})(.{8})(.{8})(.{8})(.{8})(.{8})(.{8})(.{8})/,
        '1 $1\n2 $2\n3 $3\n4 $4\n5 $5\n6 $6\n7 $7\n8 $8\n',
      ) // idiot
  }\n`);
  process.stdout.write('> ');
}

function dispatch(store, command) {
  if (command === 'start') {
    store.dispatch(startGame());
  } else if (command.startsWith('set ')) {
    const [, player, name] = command.match(/set (b|w) (.+)/);
    store.dispatch(updateConfig({path: ['player', player === 'b' ? B : W], value: name}));
  } else if (command.match(/[a-z]\d/)) {
    const [, column, row] = command.match(/([a-z])(\d)/);
    store.dispatch(input({row: row - 1, column: column.charCodeAt(0) - 97}));
  }
}

export default function cui() {
  const {store, rl} = init();
  // store.subscribe(render.bind(undefined, store, rl));
  store.subscribe(render.bind(undefined, store));
  rl.on('line', dispatch.bind(undefined, store));
}
