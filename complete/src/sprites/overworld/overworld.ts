import {SpriteSheet} from '../../types';
import './overworld.css';

export const overworld: SpriteSheet = {
  name: 'overworld',
  url: require('./overworld.png'),
  sprites: {
    grass: {size: [16, 16]},
    tree_trunk: {size: [32, 32]},
    tree: {size: [64, 80]},
  },
};
