import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Layer, StoreState} from '../../types';
import {layerSelector} from '../../data/selectors';
import {Tile} from '../tile/Tile';
import './TilesLayer.css';

// Primary input props.
interface Props {
  name: Layer['name'];
}

// Props filled in by the react-redux connect() higher-order-component.
interface PropsFromState {
  tiles: Layer['tiles'];
}

/**
 * The tiles layer is responsible for rendering all the tiles in a given layer.
 */
export class TilesLayerView extends React.PureComponent<Props & PropsFromState, {}> {
  render() {
    return (
      <div className={`layer tiles-layer tiles-layer--${this.props.name}`}>
        {_.map(this.props.tiles, ({id, tileType, bounds, edges}) => (
          <Tile
            key={id}
            id={id}
            style={{top: bounds.y, left: bounds.x}}
            tileType={tileType}
            edges={edges}
          />
        ))}
      </div>
    );
  }
}

/**
 * Connect to the our store and fetch the state of a given layer.
 */
export const TilesLayer = connect((state: StoreState, props: Props) => {
  return {...layerSelector(state, props)};
})(TilesLayerView);
