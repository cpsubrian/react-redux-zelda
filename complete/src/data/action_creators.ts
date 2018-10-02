import {Bounds, ActionTypes, LayerName} from '../types';
import * as Actions from './actions';

export const selectTileType = (tile: string): Actions.SelectTileType => {
  return {
    type: ActionTypes.SELECT_TILE_TYPE,
    tile,
  };
};

export const unselectTileType = (): Actions.UnselectTileType => {
  return {
    type: ActionTypes.UNSELECT_TILE_TYPE,
  };
};

export const paintTile = (
  layer: LayerName,
  id: string,
  tile: string,
  bounds: Bounds
): Actions.PaintTile => {
  return {
    type: ActionTypes.PAINT_TILE,
    layer,
    id,
    tile,
    bounds,
  };
};

export const eraseTile = (layer: LayerName, id: string): Actions.EraseTile => {
  return {
    type: ActionTypes.ERASE_TILE,
    layer,
    id,
  };
};
