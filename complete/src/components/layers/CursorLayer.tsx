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
  onClick?: (position: Point) => void;
  onCursorMove?: (position: Point) => void;
}

export class CursorLayer extends React.PureComponent<Props, {}> {
  /**
   * When we're updated, check if we've moved to a new
   * 'snap location'.
   */
  public componentDidUpdate(prevProps: Props) {
    if (this.props.onCursorMove) {
      const {position} = this.props;
      const {position: prevPosition} = prevProps;
      const snapPosition = this.getSnapPosition(position);
      const prevSnapPosition = this.getSnapPosition(prevPosition);

      if (snapPosition !== prevSnapPosition) {
        this.props.onCursorMove(snapPosition);
      }
    }
  }

  /**
   * Since we paint on a virtual 'grid' of tiles, we need to move the cursor
   * along that grid as well, and snap to each cell. This converts an
   * 'analog' position into a position snapped to a cell.
   *
   * @param position The position to normalize.
   */
  private getSnapPosition(position: Point): Point {
    const {cellSize, selectedTileType} = this.props;
    const tile = selectedTileType ? tiles[selectedTileType] : null;
    const snapSize = tile
      ? tile.size[0] < cellSize
        ? tile.size[0]
        : tile.size[1] < cellSize
          ? tile.size[1]
          : cellSize
      : cellSize;

    return {
      x: Math.floor(position.x / snapSize) * snapSize,
      y: Math.floor(position.y / snapSize) * snapSize,
    };
  }

  /**
   * Return the positioning and sizing for the cursor.
   */
  private getCursorStyle() {
    const {position, selectedTileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && selectedTileType) {
      const snapPosition = this.getSnapPosition(position);
      const tile = tiles[selectedTileType];

      return {
        top: snapPosition.y,
        left: snapPosition.x,
        width: tile.size[0],
        height: tile.size[0],
      };
    }

    return {
      display: 'none',
    };
  }

  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {position, selectedTileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && selectedTileType && this.props.onClick) {
      this.props.onClick(this.getSnapPosition(position));
    }
  };

  render() {
    return (
      <div className="layer cursor-layer" onClick={this.handleClick}>
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
