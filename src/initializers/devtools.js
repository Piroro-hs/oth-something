import {compose} from 'redux';

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle

const stack = {
  composers: [devtools],
};

export default stack;
