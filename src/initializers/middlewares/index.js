import {applyMiddleware} from 'redux';

import epicMiddleware from './epic';

const middleware = [
  epicMiddleware,
];

const stack = {
  enhancers: [applyMiddleware(...middleware)],
};

export default stack;
