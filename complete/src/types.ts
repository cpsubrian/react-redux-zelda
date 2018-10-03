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

export type LayerName = 'terrain' | 'objects';

export interface Layer {
  name: LayerName;
  tiles: ReadonlyArray<LayerTile>;
}

export interface LayerTile {
  id: string;
  tile: string;
  bounds: Bounds;
  edges: TileEdges;
  updated: number;
}

export interface TileSet {
  [type: string]: Tile;
}

export interface Tile {
  type: string;
  layer: LayerName;
  size: Size;
  sprite: SpriteKey;
  edges?: {
    [type: string]: {
      [direction: string]: SpriteKey;
    };
  };
}

export interface TileEdges {
  n?: string;
  s?: string;
  e?: string;
  w?: string;
  ne?: string;
  nw?: string;
  se?: string;
  sw?: string;
  naw?: string;
  nae?: string;
  saw?: string;
  sae?: string;
}

export interface SpriteSheet {
  name: string;
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
  layers: {[K in LayerName]: Layer};
}

// Mapping of 'action handlers'.
export type ActionHandlers = {
  [A in ActionTypes]: (state: StoreState, action: AnyAction) => StoreState
};

// Action type constants.
export const enum ActionTypes {
  SELECT_TILE_TYPE = 'SELECT_TILE_TYPE',
  UNSELECT_TILE_TYPE = 'UNSELECT_TILE_TYPE',
  PAINT_TILE = 'PAINT_TILE',
  ERASE_TILE = 'ERASE_TILE',
}
