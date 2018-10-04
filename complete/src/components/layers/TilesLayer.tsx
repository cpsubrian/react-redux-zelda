import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Layer, StoreState} from '../../types';
import {layerSelector} from '../../data/selectors';
import {Tile} from '../tile/Tile';
import './TilesLayer.css';

interface Props {
  name: Layer['name'];
}

interface PropsFromState {
  tiles: Layer['tiles'];
}

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

export const TilesLayer = connect((state: StoreState, props: Props) => {
  return {...layerSelector(state, props)};
})(TilesLayerView);
