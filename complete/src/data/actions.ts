import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {ActionTypes, LayerName, TileInstance, StoreState} from '../types';

/**
 * Action object type definitions.
 */

export interface SelectTileType extends Action {
  type: ActionTypes.SELECT_TILE_TYPE;
  tileType: string;
}

export interface UnselectTileType extends Action {
  type: ActionTypes.UNSELECT_TILE_TYPE;
}

export interface PaintTile extends Action {
  type: ActionTypes.PAINT_TILE;
  layer: LayerName;
  tile: TileInstance;
}

export interface EraseTile extends Action {
  type: ActionTypes.ERASE_TILE;
  layer: LayerName;
  tile: TileInstance;
}

export type PaintTileThunk = ThunkAction<void, StoreState, void, PaintTile | EraseTile>;

export type RepaintAdjacentTilesThunk = ThunkAction<void, StoreState, void, PaintTile>;
