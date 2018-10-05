import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {reducer} from './reducer';

/**
 * This is a special 'hack' needed to support the Chrome Redux DevTools.
 */
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * Create the redux store. We pass in our root reducer as
 * well as our 'composed' store enhancers. The only enhancer
 * we are using in the application is the 'middleware' layer.
 *
 * Middleware allow you to intercept actions before the store
 * processes them and change the action flow. redux-thunk
 * uses this 'hook' to support actions that are functions.
 * Other middleware could support Promise actions and other
 * more complex setups.
 */
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
