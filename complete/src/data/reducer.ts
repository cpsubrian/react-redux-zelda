import {AnyAction} from 'redux';
import {StoreState, ActionHandlers, ActionTypes} from './types';
import * as Actions from './actions';

// Initial redux store state.
const initialState: Readonly<StoreState> = {
  selected: null,
  layers: {
    base: {
      name: 'base',
      columns: {},
    },
  },
};

// Redux reducer action handlers.
const handlers: ActionHandlers = {
  [ActionTypes.SELECT_SPRITE]: (state, action: Actions.SelectSprite) => {
    return {
      ...state,
      selected: {
        sheet: action.sheet,
        sprite: action.sprite,
      },
    };
  },
  [ActionTypes.UNSELECT_SPRITE]: (state, action: Actions.UnselectSprite) => {
    return {
      ...state,
      selected: null,
    };
  },
  [ActionTypes.PAINT_SPRITE]: (state, action: Actions.PaintSprite) => {
    const {position, sheet, sprite} = action;
    const {x, y} = position;
    return {
      ...state,
      layers: {
        ...state.layers,
        base: {
          ...state.layers.base,
          columns: {
            ...state.layers.base.columns,
            [x]: {
              ...(state.layers.base.columns[x] || {}),
              updated: Date.now(),
              rows: {
                ...(state.layers.base.columns[x] ? state.layers.base.columns[x].rows : {}),
                [y]: {
                  sheet,
                  sprite,
                },
              },
            },
          },
        },
      },
    };
  },
};

// The main reducer. Defers to action handlers defined above.
export const reducer = (state: StoreState = initialState, action: AnyAction): StoreState => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
};