import {SpriteSheet} from '../../types';
import './overworld.css';

export const overworld: SpriteSheet = {
  name: 'overworld',
  url: require('./overworld.png'),
  defaults: {
    w: 16,
    h: 16,
  },
  sprites: {
    grass: {layer: 'base', w: 16, h: 16},
    tree_trunk: {layer: 'objects', w: 32, h: 32},
    tree: {layer: 'objects', w: 64, h: 80},
  },
};
