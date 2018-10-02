import {SpriteSheet} from '../../types';
import './overworld.css';

export const overworld: SpriteSheet = {
  name: 'overworld',
  sprites: {
    grass: {size: [16, 16]},
    grass_edge_water_n: {size: [16, 8]},
    grass_edge_water_s: {size: [16, 8]},
    grass_edge_water_e: {size: [8, 16]},
    grass_edge_water_w: {size: [8, 16]},
    grass_edge_water_ne: {size: [8, 8]},
    grass_edge_water_nw: {size: [8, 8]},
    grass_edge_water_se: {size: [8, 8]},
    grass_edge_water_sw: {size: [8, 8]},
    grass_edge_water_naw: {size: [8, 8]},
    grass_edge_water_nae: {size: [8, 8]},
    grass_edge_water_saw: {size: [8, 8]},
    grass_edge_water_sae: {size: [8, 8]},
    water: {size: [16, 16]},
    tree_trunk: {size: [32, 32]},
    tree: {size: [64, 80]},
    leaves: {size: [16, 16]},
    bush: {size: [16, 16]},
    flower: {size: [8, 8]},
    spot: {size: [8, 8]},
  },
};
