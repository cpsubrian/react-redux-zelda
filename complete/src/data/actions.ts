import {Action} from 'redux';
import {ActionTypes} from './types';
import {Point} from '../types';

export interface SelectSprite extends Action {
  type: ActionTypes.SELECT_SPRITE;
  sheet: string;
  sprite: string;
}

export interface UnselectSprite extends Action {
  type: ActionTypes.UNSELECT_SPRITE;
}

export interface PaintSprite extends Action {
  type: ActionTypes.PAINT_SPRITE;
  position: Point;
  sheet: string;
  sprite: string;
}
