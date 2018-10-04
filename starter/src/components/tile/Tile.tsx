import * as React from 'react';
import * as cx from 'classnames';
import * as _ from 'lodash';
import {TileEdges} from '../../types';
import {tiles} from '../../tiles';
import {Sprite} from '../sprite/Sprite';
import './Tile.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  id: string;
  tileType: string;
  edges?: TileEdges;
  onClick?: (type: string, id: string) => void;
}

/**
 * The tile component renders a single 'cell' on our game map.
 * In some cases this could be terrain and in others it could be
 * an object like a tree.
 *
 * Some tiles have 'edges', which are additional sprites that need
 * to render based on which other tiles are adjacent this one.
 */
export class Tile extends React.Component<Props, {}> {
  /**
   * Since we render many many tiles in our game map, this is
   * an important optimization to reduce the amount of
   * times the render function of this component gets called.
   */
  shouldComponentUpdate(nextProps: Props) {
    // Perform a deep props check to bail on render if nothing has changed.
    return !_.isEqual(nextProps, this.props);
  }

  /**
   * Optionally, handle a click event on a tile.
   */
  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.tileType, this.props.id);
    }
  };

  render() {
    const {className, onClick, style, tileType, edges} = this.props;
    const hasEdges = !!(edges && Object.keys(edges).length);
    const tile = tiles[tileType];
    return (
      <div
        className={cx('tile', className)}
        style={style}
        onClick={onClick ? this.handleClick : undefined}
      >
        {/* Render the primary sprite */}
        <Sprite {...tile.sprite} />

        {/* Render edges, if we have any */}
        {hasEdges && (
          <div className="edges" style={{width: tile.size[0], height: tile.size[1]}}>
            {_.map(edges, (edgeType, edgeDir) => {
              return tile.edges && tile.edges[edgeType!] && tile.edges[edgeType!][edgeDir] ? (
                <Sprite
                  key={edgeDir}
                  className={`edge edge--${edgeDir}`}
                  {...tile.edges[edgeType!][edgeDir]}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }
}
