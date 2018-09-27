import { StoreState, MouseAction, MouseActionType } from "./types";

const initialState: StoreState = {
  mouse: {
    buttonDown: false,
    point: null
  }
};

export const reducer = (
  state: StoreState = initialState,
  action:
) => {
  switch (action.type) {
    case MouseActionType.MOUSE_DOWN:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          buttonDown: true,
          point: action.point
        }
      };

    case MouseActionType.MOUSE_UP:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          buttonDown: false,
          point: action.point
        }
      };

    case MouseActionType.MOUSE_MOVE:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          point: action.point
        }
      };

    default:
      return state;
  }
};
