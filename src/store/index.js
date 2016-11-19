import { routerMiddleware, routerReducer} from 'react-router-redux';
import { applyMiddleware, compose, createStore as create, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import landingReducer from 'components/routes/Landing/LandingModule';

const RootReducer = (asyncReducers) => {
  return combineReducers({
    routing: routerReducer,
    landing: landingReducer,
    ...asyncReducers
  });
};

export const createStore = (initialState = {}, history) => {
  const loggerMiddleware = createLogger();
  const middleware = [thunkMiddleware, promiseMiddleware, routerMiddleware(history), loggerMiddleware];
  
  const store = create(
    RootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  );
  store.asyncReducers = {};
  return store;
};
