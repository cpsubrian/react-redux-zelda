import {AnyAction} from 'redux';
import {Layer} from '../types';

// Store state shape.
// All nested objects and arrays should be readonly so we can enforce compile-time immutability.
export interface StoreState {
  selected: null | Readonly<{
    sheet: string;
    sprite: string;
  }>;
  layers: {
    [key: string]: Layer;
  };
}

// Mapping of 'action handlers' (sub-reducers).
export interface ActionHandlers {
  [key: string]: (state: StoreState, action: AnyAction) => StoreState;
}

// Action type constants.
export const enum ActionTypes {
  SELECT_SPRITE = 'SELECT_SPRITE',
  UNSELECT_SPRITE = 'UNSELECT_SPRITE',
  PAINT_SPRITE = 'PAINT_SPRITE',
}
