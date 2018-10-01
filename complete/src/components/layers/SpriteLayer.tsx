import * as React from 'react';
import * as _ from 'lodash';
import {LayerColumns} from '../../types';
import {Sprite} from '../sprite/Sprite';
import './SpriteLayer.css';

interface Props {
  name: string;
  columns: LayerColumns;
}

interface ColumnProps {
  x: number;
  updated: number;
  rows: LayerColumns[0]['rows'];
}

class SpriteColumn extends React.Component<ColumnProps, {}> {
  shouldComponentUpdate(nextProps: ColumnProps) {
    return this.props.updated !== nextProps.updated;
  }
  render() {
    return (
      <div className="sprite-layer-column" style={{left: this.props.x}}>
        {_.map(this.props.rows, ({sheet, sprite}, y) => (
          <Sprite key={`row-${y}`} sheet={sheet} sprite={sprite} style={{top: parseInt(y, 10)}} />
        ))}
      </div>
    );
  }
}

export class SpriteLayer extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div className={`layer sprite-layer sprite-layer--${this.props.name}`}>
        {_.map(this.props.columns, (col, x) => (
          <SpriteColumn
            key={`column-${x}`}
            x={parseInt(x, 10)}
            updated={col.updated}
            rows={col.rows}
          />
        ))}
      </div>
    );
  }
}
