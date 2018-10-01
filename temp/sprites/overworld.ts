import {SpriteSet} from '../types';

export const overworld: SpriteSet = {
  _attrs: {
    size: [16, 16],
    url: require('./images/overworld.png'),
  },
  _children: {
    grass: {
      _attrs: {
        background: '#4B974C',
      },
      _children: {
        decorations: {
          _attrs: {
            size: [8, 8],
          },
          _children: {
            flower: {
              _attrs: {
                pos: [287, 48],
              },
            },
            spot: {
              _attrs: {
                pos: [240, 39],
              },
            },
          },
        },
        edges: {
          _attrs: {
            bounds: [16, 16],
          },
          _children: {
            water: {
              _attrs: {
                size: [8, 8],
              },
              _children: {
                s: {
                  _attrs: {
                    off: [0, -0],
                    size: [16, 8],
                    pos: [36, 185],
                  },
                },
                n: {
                  _attrs: {
                    size: [16, 8],
                    pos: [36, 227],
                  },
                },
                w: {
                  _attrs: {
                    size: [8, 16],
                    pos: [62, 202],
                  },
                },
                e: {
                  _attrs: {
                    off: [-0, 0],
                    size: [8, 16],
                    pos: [18, 202],
                  },
                },
                saw: {
                  _attrs: {
                    off: [0, -0],
                    pos: [53, 194],
                  },
                },
                sae: {
                  _attrs: {
                    off: [-0, -0],
                    pos: [27, 194],
                  },
                },
                naw: {
                  _attrs: {
                    pos: [53, 218],
                  },
                },
                nae: {
                  _attrs: {
                    off: [-0, 0],
                    pos: [27, 218],
                  },
                },
                nw: {
                  _attrs: {
                    pos: [53, 227],
                  },
                },
                ne: {
                  _attrs: {
                    off: [-0, 0],
                    pos: [27, 227],
                  },
                },
                sw: {
                  _attrs: {
                    off: [0, -0],
                    pos: [53, 185],
                  },
                },
                se: {
                  _attrs: {
                    off: [-0, -0],
                    pos: [27, 185],
                  },
                },
              },
            },
          },
        },
      },
    },
    leaves: {
      _attrs: {
        pos: [253, 57],
      },
    },
    bush: {
      _attrs: {
        pos: [304, 57],
      },
    },
    water: {
      _attrs: {
        background: '#5A81BE',
      },
    },
    tree_trunk: {
      _attrs: {
        background: '#6B976C',
        size: [32, 32],
        pos: [349, 83],
        transform: 'translate(-50%, -50%)',
      },
    },
    tree: {
      _attrs: {
        background: '#4B974C',
        size: [64, 82],
        pos: [375, 206],
        transform: 'scale(0.5) translate(-50%, -75%)',
      },
    },
  },
};
