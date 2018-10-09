import {TileSet} from '../types';

export const tiles: TileSet = {
  grass: {
    tileType: 'grass',
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
      dirt: {
        n: {sheet: 'overworld', sprite: 'grass_edge_dirt_n'},
        s: {sheet: 'overworld', sprite: 'grass_edge_dirt_s'},
        e: {sheet: 'overworld', sprite: 'grass_edge_dirt_e'},
        w: {sheet: 'overworld', sprite: 'grass_edge_dirt_w'},
        ne: {sheet: 'overworld', sprite: 'grass_edge_water_ne'},
        nw: {sheet: 'overworld', sprite: 'grass_edge_water_nw'},
        se: {sheet: 'overworld', sprite: 'grass_edge_water_se'},
        sw: {sheet: 'overworld', sprite: 'grass_edge_water_sw'},
        naw: {sheet: 'overworld', sprite: 'grass_edge_dirt_naw'},
        nae: {sheet: 'overworld', sprite: 'grass_edge_dirt_nae'},
        saw: {sheet: 'overworld', sprite: 'grass_edge_dirt_saw'},
        sae: {sheet: 'overworld', sprite: 'grass_edge_dirt_sae'},
      },
    },
  },
  water: {
    tileType: 'water',
    layer: 'terrain',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'water',
    },
  },
  dirt: {
    tileType: 'dirt',
    layer: 'terrain',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'dirt',
    },
  },
  boulder: {
    tileType: 'boulder',
    layer: 'objects',
    size: [32, 32],
    sprite: {
      sheet: 'overworld',
      sprite: 'boulder',
    },
  },
  stone: {
    tileType: 'stone',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'stone',
    },
  },
  tree: {
    tileType: 'tree',
    layer: 'objects',
    size: [64, 80],
    sprite: {
      sheet: 'overworld',
      sprite: 'tree',
    },
  },
  tree_trunk: {
    tileType: 'tree_trunk',
    layer: 'objects',
    size: [32, 32],
    sprite: {
      sheet: 'overworld',
      sprite: 'tree_trunk',
    },
  },
  leaves: {
    tileType: 'leaves',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'leaves',
    },
  },
  bush: {
    tileType: 'bush',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'overworld',
      sprite: 'bush',
    },
  },
  flower: {
    tileType: 'flower',
    layer: 'objects',
    size: [8, 8],
    sprite: {
      sheet: 'overworld',
      sprite: 'flower',
    },
  },
  spot: {
    tileType: 'spot',
    layer: 'objects',
    size: [8, 8],
    sprite: {
      sheet: 'overworld',
      sprite: 'spot',
    },
  },
  rock: {
    tileType: 'rock',
    layer: 'objects',
    size: [8, 8],
    sprite: {
      sheet: 'overworld',
      sprite: 'rock',
    },
  },
  skeleton: {
    tileType: 'skeleton',
    layer: 'objects',
    size: [32, 32],
    sprite: {
      sheet: 'overworld',
      sprite: 'skeleton',
    },
  },
  bubbles: {
    tileType: 'bubbles',
    layer: 'objects',
    size: [16, 16],
    sprite: {
      sheet: 'cliffs_water',
      sprite: 'bubbles',
    },
  },
};
