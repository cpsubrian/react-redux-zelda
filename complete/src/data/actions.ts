import {Action} from 'redux';
import {Bounds, ActionTypes} from '../types';

export interface SelectTileType extends Action {
  type: ActionTypes.SELECT_TILE_TYPE;
  tile: string;
}

export interface UnselectTileType extends Action {
  type: ActionTypes.UNSELECT_TILE_TYPE;
}

export interface PaintTile extends Action {
  type: ActionTypes.PAINT_TILE;
  layer: string;
  id: string;
  tile: string;
  bounds: Bounds;
}
