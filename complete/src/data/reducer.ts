import {AnyAction} from 'redux';
import {StoreState, ActionHandlers, ActionTypes} from '../types';
import * as Actions from './actions';

// Initial redux store state.
const initialState: Readonly<StoreState> = {
  selectedTileType: null,
  layers: {
    base: {
      name: 'base',
      tiles: [],
    },
    decorations: {
      name: 'decorations',
      tiles: [],
    },
    objects: {
      name: 'objects',
      tiles: [],
    },
  },
};

// Redux reducer action handlers.
const handlers: ActionHandlers = {
  [ActionTypes.SELECT_TILE_TYPE]: (state, action: Actions.SelectTileType) => {
    return {
      ...state,
      selectedTileType: action.tile,
    };
  },
  [ActionTypes.UNSELECT_TILE_TYPE]: (state, action: Actions.UnselectTileType) => {
    return {
      ...state,
      selectedTileType: null,
    };
  },
  [ActionTypes.PAINT_TILE]: (state, action: Actions.PaintTile) => {
    const {layer, id, tile, bounds} = action;
    return {
      ...state,
      layers: {
        ...state.layers,
        [layer]: {
          ...state.layers[layer],
          tiles: [...state.layers[layer].tiles, {id, tile, bounds}],
        },
      },
    };
  },
};

// The main reducer. Defers to action handlers defined above.
export const reducer = (state: StoreState = initialState, action: AnyAction): StoreState => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
};
