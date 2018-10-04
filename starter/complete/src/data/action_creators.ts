import {ActionCreator} from 'redux';
import {LAYERS} from '../constants';
import {ActionTypes, LayerName, TileInstance} from '../types';
import * as Actions from './actions';
import {getCollisions, getAdjacent, getEdges} from '../lib/collisions';

/**
 * Creates an action to select the given tile type.
 */
export const selectTileType: ActionCreator<Actions.SelectTileType> = (tileType: string) => {
  return {
    type: ActionTypes.SELECT_TILE_TYPE,
    tileType,
  };
};

/**
 * Creates an action that unselectes the current tile type.
 */
export const unselectTileType: ActionCreator<Actions.UnselectTileType> = () => {
  return {
    type: ActionTypes.UNSELECT_TILE_TYPE,
  };
};

/**
 * Creates a 'thunk' action that will handle painting
 * a tile to the map. Thunks are actions that are functions
 * instead of objects and they are enabled by the
 * redux-thunk middleware. The function is passed:
 *
 * - dispatch: A function that can fire off additional actions.
 * - getState: A function that returns the current store state.
 */
export const paintTile: ActionCreator<Actions.PaintTileThunk> = (
  layer: LayerName,
  tile: TileInstance
) => {
  return (dispatch, getState) => {
    // Get the tiles for this layer.
    let layers = getState().layers;

    // Check for sprite collisions in same or higher layers and erase them.
    const level = LAYERS.indexOf(layer);
    for (let i = level; i < LAYERS.length; i++) {
      getCollisions(layers[LAYERS[i]].tiles, tile.bounds).forEach(collision => {
        dispatch(eraseTile(LAYERS[i], collision));
      });
    }

    // Pain the tile, with edges recalculated.
    dispatch({
      type: ActionTypes.PAINT_TILE,
      layer,
      tile: {
        ...tile,
        edges: getEdges(layers[layer].tiles, tile),
      },
    });

    // Re-paint all adjacent tiles, so their edges can be recalculated.
    dispatch(repaintAdjacentTiles(layer, tile));
  };
};

/**
 * Re-paint tiles adjacent to the provided one, primarily so edges
 * can be recalculated.
 */
export const repaintAdjacentTiles: ActionCreator<Actions.RepaintAdjacentTilesThunk> = (
  layer: LayerName,
  tile: TileInstance
) => {
  return (dispatch, getState) => {
    const layers = getState().layers;
    const tiles = layers[layer].tiles;

    getAdjacent(tiles, tile).forEach(adjacent => {
      dispatch({
        type: ActionTypes.PAINT_TILE,
        layer,
        tile: {
          ...adjacent,
          edges: getEdges(layers[layer].tiles, adjacent),
        },
      });
    });
  };
};

/**
 * Creates an action that erases a tile from the map.
 */
export const eraseTile: ActionCreator<Actions.EraseTile> = (
  layer: LayerName,
  tile: TileInstance
) => {
  return {
    type: ActionTypes.ERASE_TILE,
    layer,
    tile,
  };
};
