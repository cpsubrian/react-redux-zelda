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
  updated?: number;
  edges?: TileEdges;
  onClick?: (type: string) => void;
}

export class Tile extends React.Component<Props, {}> {
  shouldComponentUpdate(nextProps: Props) {
    // Perform a deep props check to bail on render if nothing has changed.
    return !_.isEqual(nextProps, this.props);
  }

  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.tileType);
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
        <Sprite {...tile.sprite} />
        {hasEdges && (
          <div className="edges" style={{width: tile.size[0], height: tile.size[1]}}>
            {_.map(edges, (edgeType, edgeDir) => {
              return edgeType &&
                tile.edges &&
                tile.edges[edgeType] &&
                tile.edges[edgeType][edgeDir] ? (
                <Sprite
                  key={edgeDir}
                  className={`edge edge--${edgeDir}`}
                  {...tile.edges[edgeType][edgeDir]}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }
}
