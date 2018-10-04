import {ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {LAYERS} from '../constants';
import {StoreState, ActionTypes, LayerName, TileInstance} from '../types';
import * as Actions from './actions';
import {getCollisions, getAdjacent, getEdges} from '../lib/collisions';

export const selectTileType: ActionCreator<Actions.SelectTileType> = (tileType: string) => {
  return {
    type: ActionTypes.SELECT_TILE_TYPE,
    tileType,
  };
};

export const unselectTileType: ActionCreator<Actions.UnselectTileType> = () => {
  return {
    type: ActionTypes.UNSELECT_TILE_TYPE,
  };
};

export type PaintThunkAction = ThunkAction<
  void,
  StoreState,
  void,
  Actions.PaintTile | Actions.EraseTile
>;

export const paintTile: ActionCreator<PaintThunkAction> = (
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

    // Re-fetch the layers.
    layers = getState().layers;

    // Re-paint all adjacent tiles, so their edges can be recalculated.
    getAdjacent(layers[layer].tiles, tile).forEach(adjacent => {
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
