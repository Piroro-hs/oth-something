import initMiddlewares from './middlewares';
import initReducers from './reducers';

const stacks = [
  initMiddlewares,
  initReducers,
];

export default stacks;
