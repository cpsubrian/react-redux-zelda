import * as React from 'react';
import * as _ from 'lodash';
import {connectStub} from '../../lib/connectStub';
import {Layer} from '../../types';
import {Tile} from '../tile/Tile';
import './TilesLayer.css';

// Primary input props.
interface Props {
  name: Layer['name'];
  tiles: Layer['tiles'];
}

/**
 * The tiles layer is responsible for rendering all the tiles in a given layer.
 */
export class TilesLayerView extends React.PureComponent<Props, {}> {
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

// We'll be connecting this to our Redux store during
// the tutorial. This is just a stub to make typechecking
// pass.
export const TilesLayer = connectStub(
  {
    tiles: [],
  },
  TilesLayerView
);
