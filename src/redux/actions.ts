import { MouseAction, MouseActionType, Point } from "./types";

/**
 * Mouse actions.
 */
export const mouseDownAction = (point: Point): MouseAction => {
  return {
    type: MouseActionType.MOUSE_DOWN,
    point
  };
};

export const mouseUpAction = (point: Point): MouseAction => {
  return {
    type: MouseActionType.MOUSE_UP,
    point
  };
};

export const mouseMoveAction = (point: Point): MouseAction => {
  return {
    type: MouseActionType.MOUSE_MOVE,
    point
  };
};
