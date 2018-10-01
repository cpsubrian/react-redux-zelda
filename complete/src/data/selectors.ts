import {StoreState} from './types';
import {createSelector} from 'reselect';

export const selectedSelector = createSelector(
  (state: StoreState, props: {}) => state.selected,
  selected => selected
);

export const layersSelector = createSelector(
  (state: StoreState, props: {}) => state.layers,
  layers => layers
);

export const layerSelector = createSelector(
  layersSelector,
  (state: StoreState, props: {layer: string}) => {
    return props.layer;
  },
  (layers, layer) => {
    return layers[layer];
  }
);
