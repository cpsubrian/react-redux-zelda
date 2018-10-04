import * as React from 'react';
import * as cx from 'classnames';
import {Point} from '../../types';
import {tiles} from '../../tiles';
import {Tile} from '../tile/Tile';
import './CursorLayer.css';

interface Props {
  cellSize: number;
  position: Point;
  selectedTileType: string | null;
}

export class CursorLayer extends React.PureComponent<Props, {}> {
  private getCursorStyle() {
    const {cellSize, position, selectedTileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && selectedTileType) {
      const tile = tiles[selectedTileType];
      const snapSize =
        tile.size[0] < cellSize ? tile.size[0] : tile.size[1] < cellSize ? tile.size[1] : cellSize;
      return {
        top: Math.floor(position.y / snapSize) * snapSize,
        left: Math.floor(position.x / snapSize) * snapSize,
        width: tile.size[0],
        height: tile.size[0],
      };
    }

    return {
      display: 'none',
    };
  }
  render() {
    return (
      <div className="layer cursor-layer">
        <div
          className={cx('cursor', {'has-tile': !!this.props.selectedTileType})}
          style={this.getCursorStyle()}
        >
          {this.props.selectedTileType ? (
            <Tile
              id={`cursor-${this.props.selectedTileType}`}
              tileType={this.props.selectedTileType}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
