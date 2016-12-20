import {B, W} from '../oth';

const UPDATE_CONFIG = 'oth-something/config/UPDATE_CONFIG';

const initialState = {
  computeWait: 500,
  player: {
    [B]: 'default',
    [W]: 'default',
  },
};

const reducers = {
  [UPDATE_CONFIG](state, {payload: {path, value}}) {
    const nextState = {...state};
    path.slice(0, -1).reduce((acc, cur) => acc[cur], nextState)[path.slice(-1)[0]] = value; // eslint-disable-line no-param-reassign, fp/no-mutation
    return nextState;
  },
};

export default function reducer(state = initialState, action) {
  // return (reducers[action.type] || id)(state, action);
  return reducers[action.type] ? reducers[action.type](state, action) : state;
}

export function updateConfig(payload) {
  return {type: UPDATE_CONFIG, payload};
}
