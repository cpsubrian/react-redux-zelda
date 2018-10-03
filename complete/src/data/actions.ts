import {Action} from 'redux';
import {Bounds, ActionTypes, LayerName, TileEdges} from '../types';

export interface SelectTileType extends Action {
  type: ActionTypes.SELECT_TILE_TYPE;
  tile: string;
}

export interface UnselectTileType extends Action {
  type: ActionTypes.UNSELECT_TILE_TYPE;
}

export interface PaintTile extends Action {
  type: ActionTypes.PAINT_TILE;
  layer: LayerName;
  id: string;
  tile: string;
  bounds: Bounds;
  edges: TileEdges;
}

export interface EraseTile extends Action {
  type: ActionTypes.ERASE_TILE;
  layer: LayerName;
  id: string;
}
