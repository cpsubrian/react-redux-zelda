import {AnyAction} from 'redux';

/**************************************************************************************************
 * General Typings
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Size = [number, number];

/**************************************************************************************************
 * Tile & Sprite Typings
 */

export interface Layer {
  name: string;
  tiles: ReadonlyArray<{
    id: string;
    tile: Tile['type'];
    bounds: Bounds;
  }>;
}

export interface TileSet {
  [type: string]: Tile;
}

export interface Tile {
  type: string;
  layer: string;
  size: Size;
  sprite: SpriteKey;
}

export interface SpriteSheet {
  name: string;
  url: string;
  sprites: {
    [name: string]: SpriteAttrs;
  };
}

export interface SpriteAttrs {
  size: Size;
}

export interface SpriteKey {
  sheet: string;
  sprite: string;
}

/**************************************************************************************************
 * Redux Typings
 */

// Store state shape.
// All nested objects and arrays should be readonly so we can enforce compile-time immutability.
export interface StoreState {
  selectedTileType: Tile['type'] | null;
  layers: {
    [name: string]: Layer;
  };
}

// Mapping of 'action handlers' (sub-reducers).
export interface ActionHandlers {
  [key: string]: (state: StoreState, action: AnyAction) => StoreState;
}

// Action type constants.
export const enum ActionTypes {
  SELECT_TILE_TYPE = 'SELECT_TILE_TYPE',
  UNSELECT_TILE_TYPE = 'UNSELECT_TILE_TYPE',
  PAINT_TILE = 'PAINT_TILE',
}
