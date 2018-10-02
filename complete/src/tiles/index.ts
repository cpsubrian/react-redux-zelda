import {TileSet} from '../types';

export const tiles: TileSet = {
  grass: {
    type: 'grass',
    layer: 'base',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'grass',
    },
  },
  tree: {
    type: 'tree',
    layer: 'objects',
    size: [64, 80],
    sprite: {
      sheet: 'overworld',
      sprite: 'tree',
    },
  },
  tree_trunk: {
    type: 'tree_trunk',
    layer: 'objects',
    size: [32, 32],
    sprite: {
      sheet: 'overworld',
      sprite: 'tree_trunk',
    },
  },
};
