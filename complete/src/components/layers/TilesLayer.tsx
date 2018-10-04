import * as React from 'react';
import * as _ from 'lodash';
import {Layer} from '../../types';
import {Tile} from '../tile/Tile';
import './TilesLayer.css';

interface Props {
  name: Layer['name'];
  tiles: Layer['tiles'];
}

export class TilesLayer extends React.PureComponent<Props, {}> {
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
