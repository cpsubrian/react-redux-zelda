import {Point} from '../types';
import {ActionTypes} from './types';
import * as Actions from './actions';

export const selectSprite = (sheet: string, sprite: string): Actions.SelectSprite => {
  return {
    type: ActionTypes.SELECT_SPRITE,
    sheet,
    sprite,
  };
};

export const unselectSprite = (): Actions.UnselectSprite => {
  return {
    type: ActionTypes.UNSELECT_SPRITE,
  };
};

export const paintSprite = (
  layer: string,
  position: Point,
  sheet: string,
  sprite: string
): Actions.PaintSprite => {
  return {
    type: ActionTypes.PAINT_SPRITE,
    layer,
    position,
    sheet,
    sprite,
  };
};
