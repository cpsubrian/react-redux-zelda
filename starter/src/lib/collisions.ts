import {MAP_WIDTH, MAP_HEIGHT} from '../constants';
import {tiles as tileTypes} from '../tiles';
import {Bounds, Layer, TileEdges, TileInstance} from '../types';
import {Quadtree} from './quadtree';

/**
 * Method for calculating tile collisions and other related
 * extrapolations from them. Our method for checking collisions
 * involves two main steps:
 *
 * - First, we load all active tiles into a data structure called
 *   a QuadTree. A quad tree specializes in grouping objects
 *   in a 2-D space and subdividing that space further and further
 *   the more objects you add to it. This allows us to check for
 *   collisions without looping through the entire set of objects.
 *   Instead, the QuadTree gives us a set of possible matches
 *   based on the 'quadrants' that objects being tested share.
 *
 * - Second, we can use some simple bounds checking to confirm whether
 *   any of those objects actually collide.
 */
export const getCollisions = (tiles: Layer['tiles'], bounds: Bounds): Array<TileInstance> => {
  const quadtree = createQuadtree(tiles);
  const possible = quadtree.retrieve(bounds);
  const collisions: Array<TileInstance> = [];

  for (let check of possible) {
    if (
      bounds.x + bounds.width <= check.x ||
      bounds.x >= check.x + check.width ||
      bounds.y + bounds.height <= check.y ||
      bounds.y >= check.y + check.height
    ) {
      continue;
    } else {
      collisions.push(check.tile);
    }
  }

  return collisions;
};

/**
 * Returns a list of adjacent tiles, by checking for collisions with
 * a bounding box exactly one pixel bigger than our target on each
 * side.
 */
export const getAdjacent = (tiles: Layer['tiles'], tile: TileInstance): Array<TileInstance> => {
  // Create a box that is one pixel larger on each side.
  const edgeBounds: Bounds = {
    x: tile.bounds.x - 1,
    y: tile.bounds.y - 1,
    width: tile.bounds.width + 2,
    height: tile.bounds.height + 2,
  };

  // Get collision and return them, filtering out ourself.
  return getCollisions(tiles, edgeBounds).filter(collision => {
    return collision.id !== tile.id;
  });
};

/**
 * Special function to compute the 'edges' of a given tile.
 * Each tile type may specify which other tile types it
 * cares if its next to. For example, if a grass tile is next
 * to water we need to render extra art on those sides.
 */
export const getEdges = (tiles: Layer['tiles'], tile: TileInstance): TileEdges => {
  const {bounds, tileType} = tile;
  const edges: TileEdges = {};

  // If our tile type doesn't use edges, bail.
  if (!tileTypes[tileType] || !tileTypes[tileType].edges) {
    return edges;
  }

  // Stash the tile types we care about.
  const edgeTileTyeps = Object.keys(tileTypes[tileType].edges!);

  // Check each adjacent tile.
  getAdjacent(tiles, tile).forEach(adjacent => {
    const aType = adjacent.tileType;
    const {x, y} = adjacent.bounds;

    // Don't count ourself.
    if (tile.id === adjacent.id) {
      return;
    }

    // Bail if the current tile type is not one
    // that we care about being adjacent to.
    if (edgeTileTyeps.indexOf(aType) < 0) {
      return;
    }

    // Calculate which edge this tile is touching.
    if (y < bounds.y) {
      if (x < bounds.x) {
        edges.nw = aType;
      } else if (x >= bounds.x + bounds.width) {
        edges.ne = aType;
      } else {
        edges.n = aType;
      }
    } else if (y >= bounds.y + bounds.height) {
      if (x < bounds.x) {
        edges.sw = aType;
      } else if (x >= bounds.x + bounds.width) {
        edges.se = aType;
      } else {
        edges.s = aType;
      }
    } else {
      if (x < bounds.x) {
        edges.w = aType;
      }
      if (x >= bounds.x + bounds.width) {
        edges.e = aType;
      }
    }
  });

  // Remove redundant.
  if (edges.ne && (edges.ne === edges.n || edges.ne === edges.e)) {
    delete edges.ne;
  }
  if (edges.nw && (edges.nw === edges.n || edges.nw === edges.w)) {
    delete edges.nw;
  }
  if (edges.se && (edges.se === edges.s || edges.se === edges.e)) {
    delete edges.se;
  }
  if (edges.sw && (edges.sw === edges.s || edges.sw === edges.w)) {
    delete edges.sw;
  }

  // Edge combinations.
  if (edges.n && edges.n === edges.e) {
    edges.nae = edges.n;
  }
  if (edges.n && edges.n === edges.w) {
    edges.naw = edges.n;
  }
  if (edges.s && edges.s === edges.e) {
    edges.sae = edges.s;
  }
  if (edges.s && edges.s === edges.w) {
    edges.saw = edges.s;
  }

  return edges;
};

/**
 * Create our Quadtree data structure form an array
 * of tiles.
 */
export const createQuadtree = (tiles: Layer['tiles']) => {
  const quadtree = new Quadtree({x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT});

  // Loop over tiles and add to quadtree.
  tiles.forEach(tile => {
    quadtree.insert({...tile.bounds, tile});
  });

  return quadtree;
};
