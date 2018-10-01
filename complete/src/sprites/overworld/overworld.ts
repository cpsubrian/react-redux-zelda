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
    grass: {},
  },
};
