import * as React from 'react';
import * as cx from 'classnames';
import {tiles} from '../../tiles';
import {Tile} from '../tile/Tile';
import './CursorLayer.css';

interface Props {
  cellSize: number;
  mouseX: number;
  mouseY: number;
  selectedTileType: string | null;
}

export class CursorLayer extends React.PureComponent<Props, {}> {
  private getCursorStyle() {
    const {cellSize, mouseX, mouseY, selectedTileType} = this.props;
    const withinMap = mouseX >= 0 && mouseY >= 0;

    if (withinMap && selectedTileType) {
      const tile = tiles[selectedTileType];
      const snapSize =
        tile.size[0] < cellSize ? tile.size[0] : tile.size[1] < cellSize ? tile.size[1] : cellSize;
      return {
        top: Math.floor(mouseY / snapSize) * snapSize,
        left: Math.floor(mouseX / snapSize) * snapSize,
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
          {this.props.selectedTileType ? <Tile type={this.props.selectedTileType} /> : null}
        </div>
      </div>
    );
  }
}
