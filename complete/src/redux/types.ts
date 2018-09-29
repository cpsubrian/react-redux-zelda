import {Point} from '../types';

/**
 * Store state.
 */
export interface StoreState {
  mouse: {
    buttonDown: boolean;
    point: Point | null;
  };
}

/**
 * Mouse actions.
 */
export const enum MouseActionType {
  MOUSE_DOWN = 'MOUSE_DOWN',
  MOUSE_UP = 'MOUSE_UP',
  MOUSE_MOVE = 'MOUSE_MOVE',
}
export interface MouseAction {
  type: MouseActionType;
  point: Point;
}
