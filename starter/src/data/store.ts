import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {reducer} from './reducer';

// Support the redux Chrome devtools.
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the store.
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
