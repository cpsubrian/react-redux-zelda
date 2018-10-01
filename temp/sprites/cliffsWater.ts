import {SpriteSet} from '../types';

export const cliffsWater: SpriteSet = {
  _attrs: {
    size: [16, 16],
    url: require('./images/cliffs_water.png'),
  },
  _children: {
    water: {
      _attrs: {
        size: [8, 8],
      },
      _children: {
        decorations: {
          _children: {
            bubbles0: {
              _attrs: {
                pos: [293, 380],
              },
            },
            bubbles1: {
              _attrs: {
                pos: [302, 380],
              },
            },
            bubbles2: {
              _attrs: {
                pos: [293, 389],
              },
            },
            bubbles3: {
              _attrs: {
                pos: [311, 389],
              },
            },
          },
        },
      },
    },
  },
};
