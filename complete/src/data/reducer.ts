import {AnyAction} from 'redux';
import {StoreState, ActionHandlers, ActionTypes} from '../types';
import * as Actions from './actions';

// Initial redux store state.
const initialState: StoreState = {
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

/**
 *  Redux 'action handlers'.
 *
 * These are really just mini-reducer functions that each handle the state change for a specific
 * action. This is an alternative pattern to having one giant switch statement in the main reducer.
 */
const handlers: ActionHandlers = {
  /**
   * Dispatched when a tile type is selected from the toolbar.
   */
  [ActionTypes.SELECT_TILE_TYPE]: (state, action: Actions.SelectTileType) => {
    return {
      ...state,
      selectedTileType: action.tileType,
    };
  },

  /**
   *  Dispatched when a tile type is unselected from the toolbar.
   */
  [ActionTypes.UNSELECT_TILE_TYPE]: (state, action: Actions.UnselectTileType) => {
    return {
      ...state,
      selectedTileType: null,
    };
  },

  /**
   * Dispatched when we should 'paint' a tile into a layer.
   */
  [ActionTypes.PAINT_TILE]: (state, action: Actions.PaintTile) => {
    const {layer, tile} = action;
    const index = state.layers[layer].tiles.findIndex(({id}) => tile.id === id);
    let oldTiles = state.layers[layer].tiles;
    let newTiles: typeof oldTiles = [];

    // If tile already exists replace it, otherwise add it to the existing tiles.
    if (index >= 0) {
      newTiles = [...oldTiles.slice(0, index), tile, ...oldTiles.slice(index + 1)];
    } else {
      newTiles = [...oldTiles, tile];
    }

    return {
      ...state,
      layers: {
        ...state.layers,
        [layer]: {
          ...state.layers[layer],
          tiles: newTiles,
        },
      },
    };
  },

  /**
   *  Dispatched when a tile should be erased from a layer
   */
  [ActionTypes.ERASE_TILE]: (state, action: Actions.PaintTile) => {
    const {layer, tile} = action;
    const index = state.layers[layer].tiles.findIndex(({id}) => tile.id === id);
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

/**
 *  The main reducer. Defers to action handlers defined above.
 */
export const reducer = (state: StoreState = initialState, action: AnyAction): StoreState => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
};
