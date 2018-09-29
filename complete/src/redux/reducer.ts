import {StoreState, MouseActionType} from './types';

const initialState: StoreState = {
  mouse: {
    buttonDown: false,
    point: null,
  },
};

// tslint:disable-next-line:no-any
export const reducer = (state: StoreState = initialState, action: any): StoreState => {
  switch (action.type) {
    case MouseActionType.MOUSE_DOWN:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          buttonDown: true,
          point: action.point,
        },
      };

    case MouseActionType.MOUSE_UP:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          buttonDown: false,
          point: action.point,
        },
      };

    case MouseActionType.MOUSE_MOVE:
      return {
        ...state,
        mouse: {
          ...state.mouse,
          point: action.point,
        },
      };

    default:
      return state;
  }
};
