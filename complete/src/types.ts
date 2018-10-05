import {AnyAction} from 'redux';

/**************************************************************************************************
 * Dimensional Typings
 */

// Attributes representing a single point.
export interface Point {
  x: number;
  y: number;
}

// Attributes representing a positioned 2D box.
export interface Bounds extends Point {
  x: number;
  y: number;
  width: number;
  height: number;
}

// An abbreviated form of width and height.
export type Size = [number, number];

/**************************************************************************************************
 * Layer, Tile and Sprite Typings
 */

// Enumerate the valid layer names.
export type LayerName = 'terrain' | 'objects';

// A layer is comprised of tiles instances.
export interface Layer {
  name: LayerName;
  tiles: Array<TileInstance>;
}

// A specific tile instance, renderable to the screen.
export interface TileInstance {
  id: string;
  tileType: string;
  bounds: Bounds;
  edges: TileEdges;
}

// A set of tile definitions.
export interface TileSet {
  [type: string]: Tile;
}

// An individual tile definition.
export interface Tile {
  tileType: string;
  layer: LayerName;
  size: Size;
  sprite: SpriteKey;
  edges?: {
    [type: string]: {
      [direction: string]: SpriteKey;
    };
  };
}

// A list of the valid tile edge locations.
// E.g. n = North, s = South, nw = Northwest, naw = North and West
export type TileEdge =
  | 'n'
  | 's'
  | 'e'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw'
  | 'naw'
  | 'nae'
  | 'saw'
  | 'sae';

// A mapping of tile edges to tile types.
export type TileEdges = {[Edge in TileEdge]?: Tile['tileType']};

// A sprite-sheet. This is a single image that contains multiple sub-images that will be used
// as tile 'textures'.
export interface SpriteSheet {
  name: string;
  sprites: {
    [name: string]: SpriteAttrs;
  };
}

// The attributes for a single sprite.
export interface SpriteAttrs {
  size: Size;
}

// The properties required to identify a single sprite.
export interface SpriteKey {
  sheet: string;
  sprite: string;
}

/**************************************************************************************************
 * Redux Typings
 */

// Store state shape.
export type StoreState = Readonly<{
  selectedTileType: string | null;
  layers: {[K in LayerName]: Layer};
}>;

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
