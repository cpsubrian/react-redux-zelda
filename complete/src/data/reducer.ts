import {AnyAction} from 'redux';
import {StoreState, ActionHandlers, ActionTypes} from '../types';
import * as Actions from './actions';

// Initial redux store state.
const initialState: Readonly<StoreState> = {
  selectedTileType: null,
  layers: {
    terrain: {
      name: 'terrain',
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
  [ActionTypes.ERASE_TILE]: (state, action: Actions.PaintTile) => {
    const {layer, id} = action;
    const index = state.layers[layer].tiles.findIndex(tile => tile.id === id);
    return index >= 0
      ? {
          ...state,
          layers: {
            ...state.layers,
            [layer]: {
              ...state.layers[layer],
              tiles: [
                ...state.layers[layer].tiles.slice(0, index),
                ...state.layers[layer].tiles.slice(index + 1),
              ],
            },
          },
        }
      : state;
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
