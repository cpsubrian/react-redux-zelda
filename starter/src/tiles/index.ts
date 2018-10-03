import {TileSet} from '../types';

export const tiles: TileSet = {
  grass: {
    type: 'grass',
    layer: 'terrain',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'grass',
    },
    edges: {
      water: {
        n: {sheet: 'overworld', sprite: 'grass_edge_water_n'},
        s: {sheet: 'overworld', sprite: 'grass_edge_water_s'},
        e: {sheet: 'overworld', sprite: 'grass_edge_water_e'},
        w: {sheet: 'overworld', sprite: 'grass_edge_water_w'},
        ne: {sheet: 'overworld', sprite: 'grass_edge_water_ne'},
        nw: {sheet: 'overworld', sprite: 'grass_edge_water_nw'},
        se: {sheet: 'overworld', sprite: 'grass_edge_water_se'},
        sw: {sheet: 'overworld', sprite: 'grass_edge_water_sw'},
        naw: {sheet: 'overworld', sprite: 'grass_edge_water_naw'},
        nae: {sheet: 'overworld', sprite: 'grass_edge_water_nae'},
        saw: {sheet: 'overworld', sprite: 'grass_edge_water_saw'},
        sae: {sheet: 'overworld', sprite: 'grass_edge_water_sae'},
      },
    },
  },
  water: {
    type: 'water',
    layer: 'terrain',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'water',
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
  leaves: {
    type: 'leaves',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'leaves',
    },
  },
  bush: {
    type: 'bush',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'bush',
    },
  },
  flower: {
    type: 'flower',
    layer: 'objects',
    size: [8, 8],
    sprite: {
      sheet: 'overworld',
      sprite: 'flower',
    },
  },
  spot: {
    type: 'spot',
    layer: 'objects',
    size: [8, 8],
    sprite: {
      sheet: 'overworld',
      sprite: 'spot',
    },
  },
};
