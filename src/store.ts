import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import { map } from "./reducers/map";

export const store = createStore(
  combineReducers({ map }),
  applyMiddleware(thunk)
);
