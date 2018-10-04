import {StoreState, LayerName} from '../types';
import {createSelector} from 'reselect';

/**
 * Selectors, created via the 3rd party library reselect.
 *
 * As a general concept, a 'selector' is a function that
 * takes your store state as an input and returns a subset
 * of that state. This is a useful abstraction as your
 * components do not need to have knowledge of the store
 * structure. They can use selectors to grab only what
 * they need and keep a clear 'contract' on how to
 * access you application state.
 *
 * Reslect is a popular library to create react-redux
 * compatible selectes with upsides:
 *
 * - Takes state and props as the input.
 * - Automatically memoizes each 'level' of selection, only
 *   re-running sub-selectors if the inputs or your store
 *   state have changee.
 * - Makes it easy to chain multiple selectors together.
 */

/**
 * Select the currently selected tile type from the store.
 */
export const selectedTileTypeSelector = createSelector(
  (state: StoreState, props: {}) => state.selectedTileType,
  selectedTileType => selectedTileType
);

/**
 * Select the current state of all layers from the store.
 */
export const layersSelector = createSelector(
  (state: StoreState, props: {}) => state.layers,
  layers => layers
);

/**
 * Given a layer 'name' passed into props, select just
 * that layer from the store.
 */
export const layerSelector = createSelector(
  layersSelector,
  (state: StoreState, props: {name: LayerName}) => {
    return props.name;
  },
  (layers, name) => {
    return layers[name];
  }
);
