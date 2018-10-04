import {StoreState, LayerName} from '../types';
import {createSelector} from 'reselect';

export const selectedTileTypeSelector = createSelector(
  (state: StoreState, props: {}) => state.selectedTileType,
  selectedTileType => selectedTileType
);

export const layersSelector = createSelector(
  (state: StoreState, props: {}) => state.layers,
  layers => layers
);

export const layerSelector = createSelector(
  layersSelector,
  (state: StoreState, props: {name: LayerName}) => {
    return props.name;
  },
  (layers, name) => {
    return layers[name];
  }
);
