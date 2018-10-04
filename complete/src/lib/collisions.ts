import {MAP_WIDTH, MAP_HEIGHT} from '../constants';
import {tiles as tileTypes} from '../tiles';
import {Bounds, Layer, TileEdges} from '../types';
import {Quadtree} from './quadtree';

export type Collisions = Array<Bounds & {id: string; tileType: string}>;

export const getCollisions = (tiles: Layer['tiles'], bounds: Bounds): Collisions => {
  const quadtree = createQuadtree(tiles);
  const possible = quadtree.retrieve(bounds);
  const collisions: Collisions = [];

  for (let check of possible) {
    if (
      bounds.x + bounds.width <= check.x ||
      bounds.x >= check.x + check.width ||
      bounds.y + bounds.height <= check.y ||
      bounds.y >= check.y + check.height
    ) {
      continue;
    } else {
      collisions.push(check);
    }
  }

  return collisions;
};

export const getAdjacent = (tiles: Layer['tiles'], tileId: string, bounds: Bounds): Collisions => {
  // Create a box that is one pixel larger on each side.
  const edgeBounds: Bounds = {
    x: bounds.x - 1,
    y: bounds.y - 1,
    width: bounds.width + 2,
    height: bounds.height + 2,
  };

  // Get collision and return them, filtering out ourself.
  return getCollisions(tiles, edgeBounds).filter(collision => {
    return collision.id !== tileId;
  });
};

export const getEdges = (
  tiles: Layer['tiles'],
  tileType: string,
  tileId: string,
  bounds: Bounds
): TileEdges => {
  const edges: TileEdges = {};

  // If our tile type doesn't use edges, bail.
  if (!tileTypes[tileType] || !tileTypes[tileType].edges) {
    return edges;
  }

  // Stash the tile types we care about.
  const edgeTileTyeps = Object.keys(tileTypes[tileType].edges!);

  // Check each adjacent tile.
  getAdjacent(tiles, tileId, bounds).forEach(({x, y, width, height, id, tileType}) => {
    if (tileId === id) {
      return;
    }
    if (edgeTileTyeps.indexOf(tileType) < 0) {
      return;
    }

    if (y < bounds.y) {
      if (x < bounds.x) {
        edges.nw = tileType;
      } else if (x >= bounds.x + bounds.width) {
        edges.ne = tileType;
      } else {
        edges.n = tileType;
      }
    } else if (y >= bounds.y + bounds.height) {
      if (x < bounds.x) {
        edges.sw = tileType;
      } else if (x >= bounds.x + bounds.width) {
        edges.se = tileType;
      } else {
        edges.s = tileType;
      }
    } else {
      if (x < bounds.x) {
        edges.w = tileType;
      }
      if (x >= bounds.x + bounds.width) {
        edges.e = tileType;
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

export const createQuadtree = (tiles: Layer['tiles']) => {
  const quadtree = new Quadtree({x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT});

  // Loop over tiles and add to quadtree.
  tiles.forEach(({bounds, id, tileType}) => {
    quadtree.insert({...bounds, id, tileType});
  });

  return quadtree;
};
