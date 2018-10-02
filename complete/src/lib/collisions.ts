import {MAP_WIDTH, MAP_HEIGHT} from '../constants';
import {Bounds, Layer, TileEdges} from '../types';
import {Quadtree} from './quadtree';

export const getCollisions = (
  tiles: Layer['tiles'],
  bounds: Bounds
): Array<Bounds & {id: string; tile: string}> => {
  const quadtree = createQuadtree(tiles);
  const possible = quadtree.retrieve(bounds);
  const collisions = [];

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

export const getEdges = (tiles: Layer['tiles'], tileId: string, bounds: Bounds): TileEdges => {
  const edges: TileEdges = {};

  // Create a box that is one pixel larger on each side.
  const edgeBounds: Bounds = {
    x: bounds.x - 1,
    y: bounds.y - 1,
    width: bounds.width + 2,
    height: bounds.height + 2,
  };

  // Get collision and check each edge.
  const collisions = getCollisions(tiles, edgeBounds);
  collisions.forEach(({x, y, width, height, id, tile}) => {
    if (tileId === id) {
      return;
    }

    if (y < bounds.y) {
      if (x < bounds.x) {
        edges.nw = tile;
      } else if (x >= bounds.x + bounds.width) {
        edges.ne = tile;
      } else {
        edges.n = tile;
      }
    } else if (y >= bounds.y + bounds.height) {
      if (x < bounds.x) {
        edges.sw = tile;
      } else if (x >= bounds.x + bounds.width) {
        edges.se = tile;
      } else {
        edges.s = tile;
      }
    } else {
      if (x < bounds.x) {
        edges.w = tile;
      }
      if (x >= bounds.x + bounds.width) {
        edges.e = tile;
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
  const quadtree = new Quadtree({x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT}, 5, 10);

  // Loop over tiles and add to quadtree.
  tiles.forEach(({bounds, id, tile}) => {
    quadtree.insert({...bounds, id, tile});
  });

  return quadtree;
};
