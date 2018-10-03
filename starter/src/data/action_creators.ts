import {ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {LAYERS} from '../constants';
import {StoreState, Bounds, ActionTypes, LayerName, TileEdges} from '../types';
import * as Actions from './actions';
import {getCollisions, getAdjacent, getEdges} from '../lib/collisions';

export const selectTileType: ActionCreator<Actions.SelectTileType> = (tile: string) => {
  return {
    type: ActionTypes.SELECT_TILE_TYPE,
    tile,
  };
};

export const unselectTileType: ActionCreator<Actions.UnselectTileType> = () => {
  return {
    type: ActionTypes.UNSELECT_TILE_TYPE,
  };
};

export const paintTile: ActionCreator<
  ThunkAction<void, StoreState, void, Actions.PaintTile | Actions.EraseTile>
> = (layer: LayerName, id: string, tile: string, bounds: Bounds, edges: TileEdges) => {
  return (dispatch, getState) => {
    // Get the tiles for this layer.
    let layers = getState().layers;
    let skipPaint = false;

    // Check for sprite collisions in same or higher layers and erase them.
    const level = LAYERS.indexOf(layer);
    for (let i = level; i < LAYERS.length; i++) {
      getCollisions(layers[LAYERS[i]].tiles, bounds).forEach(collision => {
        // if the tile we're trying to paint already exists, skip the paint.
        if (collision.tile === tile && collision.x === bounds.x && collision.y === bounds.y) {
          skipPaint = true;
        } else {
          dispatch(eraseTile(LAYERS[i], collision.id));
        }
      });
    }

    // Skip the paint if nothing else is changing.
    if (skipPaint) {
      return;
    }

    // Pain the tile, with edges recalculated.
    dispatch({
      type: ActionTypes.PAINT_TILE,
      layer,
      id,
      tile,
      bounds,
      edges: getEdges(layers[layer].tiles, tile, id, bounds),
    });

    // Re-fetch the layers.
    layers = getState().layers;

    // Re-paint all adjacent tiles, so their edges can be recalculated.
    getAdjacent(layers[layer].tiles, id, bounds).forEach(collision => {
      const {id, tile, ...bounds} = collision;
      dispatch({
        type: ActionTypes.PAINT_TILE,
        layer,
        id,
        tile,
        bounds,
        edges: getEdges(layers[layer].tiles, tile, id, bounds),
      });
    });
  };
};

export const eraseTile: ActionCreator<Actions.EraseTile> = (layer: LayerName, id: string) => {
  return {
    type: ActionTypes.ERASE_TILE,
    layer,
    id,
  };
};
