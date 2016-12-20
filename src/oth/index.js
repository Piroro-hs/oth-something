const B = Symbol('black');
const W = Symbol('white');
const E = Symbol('empty');

function opp(p) {
  return p === B ? W : p === W ? B : E;
}

function board() {
  return Array(64).fill(E);
}

function toArray(b) {
  return b;
}

function get(b, {row, column}) {
  return b[(row * 8) + column];
}

function set(b, {row, column}, p) {
  const i = (row * 8) + column;
  return [...b.slice(0, i), p, ...b.slice(i + 1)];
}

function count(b, p) {
  return toArray(b).filter(piece => piece === p).length;
}

function flip(b, i) {
  return set(b, i, opp(get(b, i)));
}

function init() {
  return set(
    set(
      set(
        set(
          board(),
          {row: 4, column: 3},
          B,
        ),
        {row: 3, column: 4},
        B,
      ),
      {row: 4, column: 4},
      W,
    ),
    {row: 3, column: 3},
    W,
  );
}

/* eslint-disable fp/no-let, fp/no-loops, fp/no-mutation */
function placeableDirs(b, i, t) {
  // const d = [-1, 0, 1];
  // return d
  //   .map(dr => d.map(dc => ({dr, dc})))
  //   .reduce((prev, cur) => prev.concat(cur))
  return [
    {dr: -1, dc: -1},
    {dr: -1, dc: 0},
    {dr: -1, dc: 1},
    {dr: 0, dc: -1},
    {dr: 0, dc: 1},
    {dr: 1, dc: -1},
    {dr: 1, dc: 0},
    {dr: 1, dc: 1},
  ]
    .filter(({dr, dc}) => {
      // if (dr === 0 && dc === 0) {
      //   return false;
      // }
      let flag = false;
      let {row, column} = i;
      while (true) {
        row += dr;
        column += dc;
        if (row < 0 || row > 7 || column < 0 || column > 7 || get(b, {row, column}) === E) {
          return false;
        } else if (!flag && get(b, {row, column}) === opp(t)) {
          flag = true;
        } else if (get(b, {row, column}) === t) {
          return flag;
        }
      }
    });
}
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation */

/* eslint-disable fp/no-let, fp/no-loops, fp/no-mutation */
function place(b, i, p) {
  return placeableDirs(b, i, p).reduce((acc, {dr, dc}) => {
    let nb = acc;
    let {row, column} = i;
    while (true) {
      row += dr;
      column += dc;
      if (get(nb, {row, column}) === p) {
        return nb;
      }
      nb = set(nb, {row, column}, p);
    }
  }, set(b, i, p));
}
/* eslint-enable fp/no-let, fp/no-loops, fp/no-mutation */

function placeable(b, i, t) {
  return get(b, i) === E && placeableDirs(b, i, t).length > 0;
}

function placeables(b, t) {
  return Array(64).fill()
    .map((_, i) => ({row: Math.floor(i / 8), column: i % 8}))
    .filter(i => placeable(b, i, t));
}

export {B, E, W, board, count, flip, get, init, opp, place, placeable, placeables, set, toArray};
