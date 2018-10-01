import {SpriteSet} from '../types';
import {spriteUtils} from '../lib/sprites';

export const link: SpriteSet = {
  _attrs: {
    bounds: [16, 16],
    size: [50, 50],
    url: require('./images/link.png'),
  },
  _children: {
    poses: {
      _attrs: {
        transform: `translate(0, -10px)`,
      },
      _children: {
        walk: {
          _animation: {
            rest: 3,
            start: 3,
          },
          _children: {
            north: {
              _frames: spriteUtils.generateFrames(7, 'x', 50, {pos: [50, 100]}),
            },
            south: {
              _frames: spriteUtils.generateFrames(7, 'x', 50, {pos: [50, 50]}),
            },
            east: {
              _frames: spriteUtils.generateFrames(7, 'x', 50, {
                pos: [50, 150],
                transform: `translate(-2px, -10px)`,
              }),
            },
            west: {
              _frames: spriteUtils.generateFrames(7, 'x', 50, {
                pos: [50, 150],
                transform: `translate(-1px, -10px)`,
                flipH: true,
              }),
            },
          },
        },
        attack: {
          _animation: {
            rest: 0,
            start: 0,
            fps: 24,
            snake: false,
            loop: false,
          },
          _children: {
            north: {
              _frames: spriteUtils.generateFrames(9, 'y', 50, {
                pos: [100, 300],
                transform: `translate(-13px, -23px)`,
              }),
            },
            south: {
              _animation: {
                fps: 18,
              },
              _frames: spriteUtils.generateFrames(6, 'y', 50, {
                pos: [50, 300],
                transform: `translate(-4px, -5px)`,
              }),
            },
            east: {
              _frames: spriteUtils.generateFrames(9, 'y', 50, {pos: [150, 300]}),
            },
            west: {
              _frames: spriteUtils.generateFrames(9, 'y', 50, {pos: [150, 300], flipH: true}),
            },
          },
        },
      },
    },
  },
};
