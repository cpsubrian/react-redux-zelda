import * as _ from 'lodash';
import {SpriteSet, SpriteFrame} from '../types';

export const spriteUtils = {
  getDefinition: (sprite: SpriteSet, path?: string): SpriteSet => {
    let def: SpriteSet = {};

    if (sprite._attrs) {
      Object.assign(def, sprite._attrs);
    }
    if (sprite._animation) {
      Object.assign(def._animation, sprite._animation);
    }

    if (path) {
      path.split('.').reduce((parent, key) => {
        let child = spriteUtils.getIn(parent, key);
        if (child) {
          if (child._attrs) {
            Object.assign(def, child._attrs);
          }
          if (child._animation) {
            Object.assign(def, {_animation: {...(def._animation || {}), ...child._animation}});
          }
          return child;
        }
        return {};
      }, sprite);
    }

    return def;
  },

  getIn: (sprite: SpriteSet, path: string): SpriteSet | null => {
    return path.split('.').reduce((memo, key) => {
      if (memo._children && memo._children.hasOwnProperty(key)) {
        return memo._children[key];
      }
      return null;
    }, sprite);
  },

  getFrames: (sprite: SpriteSet, ...path: string[]) => {
    let def = spriteUtils.getDefinition(sprite, ...path);
    let animation = def._animation;
    let frames = def._frames || [];

    return Object.assign({}, animation, {
      frames: frames.map((frame: SpriteFrame) => {
        return Object.assign({}, def, frame);
      }),
    });
  },

  generateFrames: (numFrames: number, axis: 'x' | 'y', offset: number, baseProps: Sprite) => {
    let frames = [];
    for (let i = 0; i < numFrames; i++) {
      if (i === 0) {
        frames.push(_.cloneDeep(baseProps));
      } else {
        let frame: SpriteFrame = _.cloneDeep(frames[i - 1]);
        if (axis === 'x') {
          frame.pos[0] += offset;
        }
        if (axis === 'y') {
          frame.pos[1] += offset;
        }
        frames.push(frame);
      }
    }
    return frames;
  },
};
