import * as React from 'react';
import * as cx from 'classnames';
import * as _ from 'lodash';
import {Point} from '../../types';
import {tiles} from '../../tiles';
import {Tile} from '../tile/Tile';
import './CursorLayer.css';

interface Props {
  cellSize: number;
  position: Point;
  tileType: string | null;
  onCursorDown?: (position: Point) => void;
  onCursorUp?: (position: Point) => void;
  onCursorMove?: (position: Point) => void;
}

/**
 * The cursor layer provides two main functions:
 *
 * - It responsed to position changes and renders a cursor (a floating tile).
 * - It tracks movement against 'snap points' that are determined based
 *   on the cellSize or the size of the tile, whichever is smaller.
 */
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

      if (!_.isEqual(snapPosition, prevSnapPosition)) {
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
    const {cellSize, tileType} = this.props;
    const tile = tileType ? tiles[tileType] : null;
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
    const {position, tileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && tileType) {
      const snapPosition = this.getSnapPosition(position);
      const tile = tiles[tileType];

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

  /**
   * Handle mousedown, invoking a callback with the current snapped cursor position.
   */
  private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const {position, tileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && tileType && this.props.onCursorDown) {
      this.props.onCursorDown(this.getSnapPosition(position));
    }
  };

  /**
   * Handle mouseup, invoking a callback with the current snapped cursor position.
   */
  private handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const {position, tileType} = this.props;
    const withinMap = position.x >= 0 && position.y >= 0;

    if (withinMap && tileType && this.props.onCursorUp) {
      this.props.onCursorUp(this.getSnapPosition(position));
    }
  };

  render() {
    return (
      <div
        className="layer cursor-layer"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <div
          className={cx('cursor', {'has-tile': !!this.props.tileType})}
          style={this.getCursorStyle()}
        >
          {this.props.tileType ? (
            <Tile id={`cursor-${this.props.tileType}`} tileType={this.props.tileType} />
          ) : null}
        </div>
      </div>
    );
  }
}
